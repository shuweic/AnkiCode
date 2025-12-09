import { useQuery } from "@tanstack/react-query";

import { Card, Flex, Typography } from "antd";

import { dashboardApi } from "@/api/dashboard";
import Loading from "@/components/Loading";

import "./Review.css";

const { Title, Text, Link } = Typography;

export default function Review() {
    const { data, isLoading } = useQuery({
        queryKey: ['todayReview'],
        queryFn: () => dashboardApi.getTodayReview(),
    });

    if (isLoading) {
        return
        <div className="review">
            <div className="loading">
                <Loading />
            </div>
        </div>;
    }

    return (
        <div className="review">
            {
                data!.data.items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎉</div>
                        <div className="empty-state-title">Awesome!</div>
                        <div className="empty-state-text">No problems due for review today</div>
                    </div>
                ) : (
                    <Flex vertical gap={16}>
                        {
                            data!.data.items.map((item, index) => {
                                const [name, ..._] = item.problem.name.split('#');
                                const titleSlug = name.trim().toLowerCase().split(' ').join('-');
                                return (
                                    <Card size="small" className="problem" key={item.problem.id}>
                                        <Flex align="center" gap={8}>
                                            <div className="number">#{index + 1}</div>
                                            <Flex vertical justify="center" className="title">
                                                <Link href={`https://leetcode.com/problems/${titleSlug}/description/`} target="_blank">
                                                    <Title level={5} className="name">
                                                        {item.problem.name}
                                                    </Title>
                                                </Link>
                                            </Flex>
                                        </Flex>
                                        <Flex>
                                            <div className="detail">
                                                <div className="marker">
                                                    <span className={`badge badge-${item.problem.status}`}>
                                                        {item.problem.status === 'todo' && 'To Start'}
                                                        {item.problem.status === 'in_progress' && 'In Progress'}
                                                        {item.problem.status === 'done' && 'Completed'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="label">Rating:{" "}</span>
                                                    <Text>{'⭐'.repeat(item.problem.rating)}</Text>
                                                </div>
                                                <div>
                                                    <span className="label">Due:{" "}</span>
                                                    <Text>{new Date(item.problem.deadline).toLocaleDateString('en-US')}</Text>
                                                </div>
                                                {item.reminder && (
                                                    <div>
                                                        <span className="label">Scheduled:{" "}</span>
                                                        <Text>{new Date(item.reminder.scheduledFor).toLocaleDateString('en-US')}</Text>
                                                    </div>
                                                )}

                                            </div>
                                        </Flex>
                                    </Card>)
                            })
                        }
                    </Flex>
                )}
        </div>
    )
}