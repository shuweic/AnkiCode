// Format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ReminderWithProblem {
  _id: any;
  problemId: {
    leetcodeId?: number;
    titleSlug?: string;
    name: string;
    difficulty: string;
  };
  scheduledFor: Date;
}

// Generate email HTML content
export function generateReminderEmailHTML(userName: string, reminders: ReminderWithProblem[]): string {
  const problemList = reminders
    .map((r) => {
      const problem = r.problemId;
      const scheduledDate = formatDate(r.scheduledFor);
      const leetcodeUrl = problem.leetcodeId
        ? `https://leetcode.com/problems/${problem.titleSlug}/`
        : '#';
      
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">
              ${problem.leetcodeId ? `#${problem.leetcodeId}` : ''} ${problem.name}
            </div>
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">
              Difficulty: <span style="color: ${
                problem.difficulty === 'Easy' ? '#10b981' : 
                problem.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
              }">${problem.difficulty}</span>
            </div>
            <div style="font-size: 13px; color: #6b7280;">
              Scheduled for: ${scheduledDate}
            </div>
            ${problem.leetcodeId ? `<div style="margin-top: 8px;"><a href="${leetcodeUrl}" style="color: #4f46e5; text-decoration: none;">View on LeetCode →</a></div>` : ''}
          </td>
        </tr>
      `;
    })
    .join('');

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #4f46e5; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📚 Review Reminders</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">
          Hi ${userName},
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px;">
          You have <strong>${reminders.length}</strong> problem${reminders.length > 1 ? 's' : ''} scheduled for review by the end of tomorrow:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          ${problemList}
        </table>
        
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <a href="${frontendUrl}" 
             style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            View in AnkiCode
          </a>
        </div>
        
        <p style="margin: 24px 0 0 0; font-size: 13px; color: #6b7280; text-align: center;">
          Happy coding! 🚀
        </p>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email content
export function generateReminderEmailText(userName: string, reminders: ReminderWithProblem[]): string {
  const problemList = reminders
    .map((r) => {
      const problem = r.problemId;
      const scheduledDate = formatDate(r.scheduledFor);
      const leetcodeUrl = problem.leetcodeId
        ? `https://leetcode.com/problems/${problem.titleSlug}/`
        : '#';
      
      return `- ${problem.leetcodeId ? `#${problem.leetcodeId} ` : ''}${problem.name} (${problem.difficulty})
    Scheduled for: ${scheduledDate}
    ${problem.leetcodeId ? `Link: ${leetcodeUrl}` : ''}`;
    })
    .join('\n\n');

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return `
Hi ${userName},

You have ${reminders.length} problem${reminders.length > 1 ? 's' : ''} scheduled for review by the end of tomorrow:

${problemList}

View in AnkiCode: ${frontendUrl}

Happy coding! 🚀
  `.trim();
}

