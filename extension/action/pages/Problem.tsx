import { useEffect, useState } from "react"

import { SmileOutlined } from '@ant-design/icons';
import { Typography, Result, Card, Flex, Button, message, Input } from "antd";
import { PlusIcon } from "lucide-react";

import Loading from "@/components/Loading";
import { problemsApi } from "@/api/problems";
import type { ConfidenceEntry, ConfidenceLevel, Problem } from "@/types";

import "./Problem.css";
import { dashboardApi } from "@/api/dashboard";


const { Title, Text } = Typography;

enum ProblemStateTag {
    Undecided,
    NoProblem,
    HasProblem,
    AddProblem,
    AddPractice,
}

type ProblemData = {
    titleSlug: string,
    title: string,
    leetcodeId?: string,
    tags?: string[],
    problem?: Problem,
    tab: chrome.tabs.Tab,
}

type ProblemState = {
    tag: ProblemStateTag,
    data?: ProblemData,
}

async function executeScriptInTab<T>(tabId: number, fn: (args: unknown[]) => T, ...args: [unknown[]]): Promise<T> {
    const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: fn,
        args: args,
    });
    return result as T;
}

function extractLeetCodeProblemTitle(title: string): { leetcodeId?: string, title: string } {
    const match = title.match(/^(\d+)\.\s+(.*)$/);
    if (match) {
        return {
            leetcodeId: match[1],
            title: match[2],
        };
    } else {
        return {
            title,
        };
    }
}

export default function Problem() {
    const [problemState, setProblemState] = useState<ProblemState>({
        tag: ProblemStateTag.Undecided,
    });
    const LEETCODE_PROBLEM_PREFIX = "https://leetcode.com/problems/";
    const [messageApi, contextHolder] = message.useMessage();
    const [confidence, setConfidence] = useState<string>('hard');
    const [duration, setDuration] = useState<number>(30);

    useEffect(() => {
        (async () => {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0 && tabs[0].url) {
                const tab = tabs[0];
                if (tab.url && tab.url.startsWith(LEETCODE_PROBLEM_PREFIX)) {
                    const titleSlug = tab.url.substring(LEETCODE_PROBLEM_PREFIX.length).split("/")[0];
                    const title = await executeScriptInTab(tab.id!, (titleSlug) => {
                        return document.querySelector(`a[href="/problems/${titleSlug}/"]`)?.textContent || "";
                    }, [titleSlug]);
                    const { leetcodeId, title: title_ } = extractLeetCodeProblemTitle(title);
                    const tags = await executeScriptInTab(tab.id!, () => {
                        return Array.from(document.querySelectorAll('a[href^="/tag/"]'))
                            .map(a => a.textContent.trim());
                    }, []);
                    let response = await problemsApi.getProblems({ q: title });
                    const problem = response.data.problems.find(p => p.titleSlug === titleSlug);
                    if (!problem) {
                        setProblemState({
                            tag: ProblemStateTag.HasProblem,
                            data: {
                                titleSlug,
                                title: title_!,
                                leetcodeId,
                                tags,
                                tab,
                            }
                        });
                        return;
                    }

                    setProblemState({
                        tag: ProblemStateTag.HasProblem,
                        data: {
                            titleSlug,
                            title: title_!,
                            leetcodeId,
                            tags,
                            tab,
                            problem,
                        }
                    });
                    return;
                }

                setProblemState({
                    tag: ProblemStateTag.NoProblem,
                });
                return;
            }
        })();
    }, [])

    const onAddProblem = async () => {
        if (problemState.tag != ProblemStateTag.HasProblem) {
            return;
        }

        setProblemState({
            tag: ProblemStateTag.AddProblem,
            data: problemState.data,
        });
        let problem: Problem;
        try {
            const response = await problemsApi.createProblem({
                leetcodeId: +problemState.data!.leetcodeId!,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            });
            problem = response.data;
        } catch (error: any) {
            console.error("Failed to add problem:", error);
            const errorMessage = error.response?.data?.message || 'Failed to add problem. Please try again.';
            messageApi.open({
                type: 'error',
                content: errorMessage,
            });
            setProblemState({
                tag: ProblemStateTag.HasProblem,
                data: problemState.data,
            });
            return;
        }
        setProblemState({
            tag: ProblemStateTag.HasProblem,
            data: {
                ...problemState.data!,
                problem,
            },
        });
    }

    const onAddPractice = async () => {
        if (problemState.tag != ProblemStateTag.HasProblem) {
            return;
        }
        setProblemState({
            tag: ProblemStateTag.AddPractice,
            data: problemState.data,
        });

        const date = new Date().toISOString();
        console.log(problemState.data)
        try {
            await dashboardApi.markDone({
                problemId: problemState.data!.problem!._id!,
                confidence: confidence as ConfidenceLevel,
                durationSec: duration * 60,
                completedAt: date,
            })
        } catch (error: any) {
            console.error("Failed to add practice:", error);
            const errorMessage = error.response?.data?.message || 'Failed to add practice. Please try again.';
            messageApi.open({
                type: 'error',
                content: errorMessage,
            });
            setProblemState({
                tag: ProblemStateTag.HasProblem,
                data: problemState.data,
            });
            return;
        }
        setProblemState({
            tag: ProblemStateTag.HasProblem,
            data: {
                ...problemState.data!,
                problem: {
                    ...problemState.data!.problem!,
                    confidenceHistory: [
                        ...(problemState.data!.problem!.confidenceHistory || []),
                        {
                            date,
                            level: confidence as ConfidenceLevel,
                        } as ConfidenceEntry,
                    ],
                },
            },
        });
        messageApi.open({
            type: 'success',
            content: 'Practice added successfully!',
        });
    }

    return (
        <>
            {contextHolder}
            <div className="problem">
                {
                    problemState.tag ==
                        ProblemStateTag.Undecided ? (
                        <div className="loading">
                            <Loading />
                        </div>
                    )
                        : (problemState.tag == ProblemStateTag.NoProblem ? (
                            <div className="no-problem">
                                <Result
                                    icon={<SmileOutlined />}
                                    title={
                                        <Title level={5}>Opens a LeetCode problem page to use AnkiCode</Title>
                                    }
                                />
                            </div>
                        ) : (
                            <div className="has-problem">
                                <Card size="small">
                                    <Title level={5} className="head">{problemState.data?.title}</Title>
                                    {
                                        problemState.data && problemState.data.problem?.status && <div className="marker">
                                            <span className={`badge badge-${problemState.data?.problem?.status}`}>
                                                {problemState.data?.problem?.status === 'todo' && 'To Start'}
                                                {problemState.data?.problem?.status === 'in_progress' && 'In Progress'}
                                                {problemState.data?.problem?.status === 'done' && 'Completed'}
                                            </span>
                                        </div>
                                    }
                                    <Flex className="tags">
                                        <Text strong className="label">Tags: {" "}</Text>
                                        <Flex gap={4} className="tags-inner">
                                            {problemState.data?.tags?.map((tag, index) => (
                                                <span key={index} className="tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </Flex>
                                    </Flex>
                                    {problemState.data?.problem ? (
                                        <div>
                                            <Flex vertical gap={8} className="confidence-history">
                                                {

                                                    problemState.data?.problem?.confidenceHistory?.map((entry, index) => (
                                                        <Card key={index} type="inner" className="confidence-entry" size="small">
                                                            <Flex justify="space-between">
                                                                <Text>{new Date(entry.date).toLocaleDateString()}: </Text>
                                                                <Text strong>{`${entry.level[0].toUpperCase()}${entry.level.slice(1)}`}</Text>
                                                            </Flex>
                                                        </Card>
                                                    ))

                                                }
                                            </Flex>
                                        </div>
                                    )
                                        : (
                                            <Flex justify="end">
                                                <Button
                                                    color="orange"
                                                    variant="solid"
                                                    className="add-to-collection"
                                                    loading={problemState.tag == ProblemStateTag.AddProblem}
                                                    onClick={onAddProblem}
                                                >
                                                    <PlusIcon size={18} />
                                                    <span>Add Problem</span>
                                                </Button>
                                            </Flex>
                                        )}
                                </Card>
                                {
                                    problemState.data && problemState.data.problem && (
                                        <div className="record">
                                            <Text strong>Confidence Level</Text>
                                            <Flex justify="space-between">
                                                <button
                                                    className={`confidence-btn confidence-hard ${confidence === 'hard' ? 'active' : ''
                                                        }`}
                                                    onClick={() => setConfidence('hard')}
                                                >
                                                    <span className="confidence-icon">😰</span>
                                                    <span className="confidence-label">Hard</span>
                                                    <span className="confidence-desc">Review in 1 day</span>
                                                </button>
                                                <button
                                                    className={`confidence-btn confidence-medium ${confidence === 'medium' ? 'active' : ''
                                                        }`}
                                                    onClick={() => setConfidence('medium')}
                                                >
                                                    <span className="confidence-icon">🤔</span>
                                                    <span className="confidence-label">Medium</span>
                                                    <span className="confidence-desc">Review in 3 days</span>
                                                </button>
                                                <button
                                                    className={`confidence-btn confidence-easy ${confidence === 'easy' ? 'active' : ''
                                                        }`}
                                                    onClick={() => setConfidence('easy')}
                                                >
                                                    <span className="confidence-icon">😊</span>
                                                    <span className="confidence-label">Easy</span>
                                                    <span className="confidence-desc">Review in 7 days</span>
                                                </button>
                                            </Flex>
                                            <Text strong>Duration (minutes)</Text>
                                            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                                            <Flex justify="end">
                                                <Button
                                                    color="orange"
                                                    variant="solid"
                                                    className="add-practice"
                                                    loading={problemState.tag == ProblemStateTag.AddPractice}
                                                    onClick={onAddPractice}
                                                >
                                                    <PlusIcon size={18} />
                                                    <span>Add Practice</span>
                                                </Button>
                                            </Flex>
                                        </div>
                                    )
                                }
                            </div>
                        ))
                }
            </div>
        </>
    )
}