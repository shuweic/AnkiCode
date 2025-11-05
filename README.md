# Ankicode - LeetCode 智能复习系统

> 基于遗忘曲线的 LeetCode 题目智能复习管理系统

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248)](https://www.mongodb.com/)

## 📚 项目简介

Ankicode 是一个全栈 Web 应用，专为 LeetCode 刷题者设计，帮助用户通过科学的遗忘曲线算法高效复习已做过的题目。系统自动从 LeetCode API 获取题目信息，根据用户的掌握程度智能安排复习计划。

### 核心特性

- 🧠 **智能复习算法** - 基于艾宾浩斯遗忘曲线，根据掌握程度自动调整复习间隔
- 💻 **LeetCode 集成** - 自动获取题目信息、难度、标签等元数据
- 📊 **可视化仪表板** - 实时查看学习进度和复习统计
- 📅 **今日复习** - 每日复习清单，高效管理时间
- 🎯 **个性化笔记** - 为每道题添加解题思路和笔记
- 🔔 **智能提醒** - 基于复习计划的提醒系统

---

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.2 | UI 框架 |
| **TypeScript** | 5.3 | 类型安全 |
| **Vite** | 5.0 | 构建工具 |
| **React Router** | 6.20 | 路由管理 |
| **React Query** | 5.12 | 数据获取和缓存 |
| **Axios** | 1.6 | HTTP 客户端 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | 20+ | 运行环境 |
| **Express** | 4.18 | Web 框架 |
| **TypeScript** | 5.3 | 类型安全 |
| **MongoDB** | 8.0 | 数据库 |
| **Mongoose** | 8.0 | ODM |
| **JWT** | 9.0 | 身份认证 |
| **Zod** | 3.22 | 数据验证 |
| **Bcrypt** | 5.1 | 密码加密 |

---

## 📁 项目结构

```
teamProj/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── models/            # Mongoose 数据模型
│   │   │   ├── User.ts        # 用户模型
│   │   │   ├── Problem.ts     # 题目模型
│   │   │   └── Reminder.ts    # 提醒模型
│   │   ├── controllers/       # 业务逻辑控制器
│   │   │   ├── authController.ts
│   │   │   ├── problemController.ts
│   │   │   ├── reminderController.ts
│   │   │   ├── dashboardController.ts
│   │   │   ├── settingsController.ts
│   │   │   └── leetcodeController.ts
│   │   ├── routes/            # API 路由
│   │   │   ├── auth.ts
│   │   │   ├── problems.ts
│   │   │   ├── reminders.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── settings.ts
│   │   │   └── leetcode.ts
│   │   ├── middleware/        # 中间件
│   │   │   ├── auth.ts        # JWT 认证
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── services/          # 业务服务层
│   │   │   └── leetcodeService.ts
│   │   ├── validators/        # Zod 验证模式
│   │   │   ├── auth.ts
│   │   │   └── problem.ts
│   │   ├── utils/             # 工具函数
│   │   │   └── responseWrapper.ts
│   │   └── index.ts           # 应用入口
│   ├── .env                   # 环境变量
│   └── package.json
│
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # React 组件
│   │   │   ├── Layout/
│   │   │   │   ├── MainLayout.tsx    # 主布局
│   │   │   │   └── Sidebar.tsx       # 侧边栏
│   │   │   └── AddLeetCodeProblem.tsx # 添加题目组件
│   │   ├── pages/             # 页面组件
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Problems.tsx
│   │   │   ├── ProblemDetail.tsx
│   │   │   ├── TodayReview.tsx
│   │   │   ├── Reminders.tsx
│   │   │   └── Settings.tsx
│   │   ├── api/               # API 客户端
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── problems.ts
│   │   │   ├── reminders.ts
│   │   │   └── dashboard.ts
│   │   ├── contexts/          # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── types/             # TypeScript 类型
│   │   │   └── index.ts
│   │   ├── styles/            # 全局样式
│   │   │   ├── theme.css      # 主题变量
│   │   │   └── global.css     # 全局样式
│   │   ├── App.tsx            # 应用根组件
│   │   └── main.tsx           # 应用入口
│   └── package.json
│
└── database_scripts/           # 数据库脚本
    ├── seed-leetcode.ts       # 种子数据
    └── wipe.ts                # 清空数据库
```

---

## 🚀 快速开始

### 前置要求

- **Node.js** 20+ 和 npm
- **MongoDB Atlas** 账户（或本地 MongoDB）
- **终端** 访问权限

### 1. 克隆项目

```bash
cd /path/to/your/workspace
```

### 2. 配置后端

```bash
cd backend

# 创建 .env 文件
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
EOF

# 安装依赖
npm install

# 启动后端开发服务器
npm run dev
```

后端将在 `http://localhost:3000` 运行

### 3. 配置前端

```bash
cd ../frontend

# 创建 .env 文件
cat > .env << EOF
VITE_API_URL=http://localhost:3000
EOF

# 安装依赖
npm install

# 启动前端开发服务器
npm run dev
```

前端将在 `http://localhost:5173` 运行

### 4. 初始化数据库（可选）

```bash
cd ../database_scripts

# 安装依赖
npm install

# 运行种子脚本（创建演示数据）
npx tsx seed-leetcode.ts
```

**演示账号：**
- 邮箱：`demo@example.com`
- 密码：`password123`

---

## 📊 数据模型

### User（用户）

```typescript
interface IUser {
  name: string;                    // 用户名
  email: string;                   // 邮箱（唯一）
  password: string;                // 加密密码
  leetcodeUsername?: string;       // LeetCode 用户名（可选）
  problemIds: ObjectId[];          // 关联的题目 ID 列表
  settings: {
    notifications: {
      optIn: boolean;              // 是否开启通知
    };
    skipWeekends?: boolean;        // 是否跳过周末
  };
}
```

### Problem（题目）

```typescript
interface IProblem {
  leetcodeId: number;              // LeetCode 题号
  titleSlug: string;               // 题目 slug
  name: string;                    // 题目名称
  difficulty: string;              // 难度：Easy/Medium/Hard
  deadline: Date;                  // 截止日期
  notes: string;                   // 用户笔记
  tags: string[];                  // 标签（数组、字符串等）
  status: 'todo' | 'in_progress' | 'done';  // 状态
  lastPracticedAt?: Date;          // 最后练习时间
  confidenceHistory: Array<{      // 信心度历史
    date: Date;
    level: 'hard' | 'medium' | 'easy';
  }>;
  ownerId: ObjectId;               // 所属用户 ID
}

// 唯一索引：同一用户不能添加相同题号两次
Index: { ownerId: 1, leetcodeId: 1 } unique
```

### Reminder（提醒）

```typescript
interface IReminder {
  problemId: ObjectId;             // 关联的题目 ID
  userId: ObjectId;                // 关联的用户 ID
  scheduledFor: Date;              // 计划提醒时间
  status: 'pending' | 'sent' | 'snoozed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API 文档

### 统一响应格式

所有 API 响应都遵循以下格式：

```typescript
{
  message: string;        // 操作结果消息
  data: T | null;         // 响应数据（成功时）或 null（失败时）
}
```

### 认证接口 `/api/auth`

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| POST | `/register` | 用户注册 | `{ name, email, password }` |
| POST | `/login` | 用户登录 | `{ email, password }` |
| POST | `/logout` | 退出登录 | 无 |
| GET | `/me` | 获取当前用户 | 无（需要 JWT） |

**认证方式：** Bearer Token

```bash
Authorization: Bearer <jwt_token>
```

### 题目接口 `/api/problems`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/` | 获取题目列表（支持查询、排序、分页） | 需要认证 |
| GET | `/:id` | 获取单个题目详情 | 需要认证 |
| POST | `/` | 创建新题目 | 需要认证 |
| PUT | `/:id` | 更新题目 | 需要认证 |
| DELETE | `/:id` | 删除题目 | 需要认证 |

**查询参数示例：**

```
GET /api/problems?status=todo&sort=-createdAt&page=1&limit=10
```

**创建题目示例：**

```json
POST /api/problems
{
  "leetcodeId": 1,
  "deadline": "2025-11-12T00:00:00.000Z",
  "notes": "Two Sum - 经典哈希表题目"
}
```

### LeetCode 接口 `/api/leetcode`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/search?questionId=1` | 搜索 LeetCode 题目 | 需要认证 |

### Dashboard 接口 `/api/dashboard`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/today` | 获取今日待复习题目 | 需要认证 |
| POST | `/mark-done` | 标记练习完成 | 需要认证 |

**标记完成示例：**

```json
POST /api/dashboard/mark-done
{
  "problemId": "507f1f77bcf86cd799439011",
  "confidenceLevel": "easy",
  "timeSpent": 15
}
```

### 提醒接口 `/api/reminders`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/` | 获取提醒列表 | 需要认证 |
| POST | `/` | 创建提醒 | 需要认证 |
| PUT | `/:id` | 更新提醒 | 需要认证 |
| DELETE | `/:id` | 删除提醒 | 需要认证 |

### 设置接口 `/api/settings`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/` | 获取用户设置 | 需要认证 |
| PUT | `/notifications` | 更新通知设置 | 需要认证 |
| PUT | `/leetcode-username` | 设置 LeetCode 用户名 | 需要认证 |
| GET | `/leetcode-stats` | 获取 LeetCode 统计 | 需要认证 |

---

## 🧠 遗忘曲线算法

系统根据用户标记的"信心度"自动计算下次复习时间：

```typescript
// 复习间隔规则
const INTERVALS = {
  hard: 1,      // 不熟悉：1 天后复习
  medium: 3,    // 一般：3 天后复习
  easy: 7       // 熟练：7 天后复习
};

// 如果连续多次标记为 "easy"，间隔会逐渐延长
// 第 1 次 easy: 7 天
// 第 2 次 easy: 14 天
// 第 3 次 easy: 30 天
```

**核心逻辑在：** `backend/src/controllers/dashboardController.ts` 的 `markPracticeDone` 函数

---

## 🎨 前端架构

### 路由结构

```typescript
// src/App.tsx
<Routes>
  {/* 公开路由 */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* 受保护路由 */}
  <Route element={<PrivateRoute />}>
    <Route element={<MainLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/today" element={<TodayReview />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/:id" element={<ProblemDetail />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Route>
</Routes>
```

### 状态管理

- **认证状态**：`AuthContext` + `localStorage`
- **服务器状态**：`React Query` (缓存、自动重新获取)
- **表单状态**：`useState` (本地状态)

### 主题系统

全局 CSS 变量定义在 `src/styles/theme.css`：

```css
:root {
  --brand-primary: #FFA116;    /* 主色：橙色 */
  --brand-secondary: #2CBB5D;  /* 辅助色：绿色 */
  --brand-danger: #EF4743;     /* 危险色：红色 */
  --brand-info: #00A8E1;       /* 信息色：蓝色 */
  /* ... 更多变量 */
}
```

---

## 🛠️ 开发指南

### 添加新的 API 端点

1. **定义路由** (`backend/src/routes/`)
2. **创建控制器** (`backend/src/controllers/`)
3. **添加验证** (`backend/src/validators/`)
4. **更新前端 API 客户端** (`frontend/src/api/`)
5. **创建/更新前端组件**

### 添加新的页面

1. **创建页面组件** (`frontend/src/pages/`)
2. **添加路由** (`frontend/src/App.tsx`)
3. **创建对应 CSS** (使用主题变量)
4. **更新侧边栏导航** (`frontend/src/components/Layout/Sidebar.tsx`)

### 数据验证流程

```
用户输入 → 前端验证 → API 请求 → Zod 验证 → 控制器处理 → 数据库
```

### 错误处理

所有错误通过 `AppError` 类统一处理：

```typescript
// backend/src/middleware/errorHandler.ts
throw new AppError('错误消息', 400);  // 抛出错误
```

---

## 🧪 测试

### 测试后端 API

```bash
# 健康检查
curl http://localhost:3000/api/health

# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# 获取题目列表（需要 token）
curl http://localhost:3000/api/problems \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 使用种子数据

```bash
cd database_scripts
npx tsx seed-leetcode.ts
```

创建：
- 1 个演示用户
- 14 个 LeetCode 题目
- 相应的复习提醒

---

## 🐛 常见问题

### 1. 端口被占用

**错误：** `EADDRINUSE: address already in use :::3000`

**解决：**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 2. MongoDB 连接失败

**错误：** `MongoNetworkError: failed to connect to server`

**检查：**
- ✅ MongoDB URI 是否正确
- ✅ IP 白名单是否包含 `0.0.0.0/0`（开发环境）
- ✅ 用户名和密码是否正确
- ✅ 网络连接是否正常

### 3. CORS 错误

**错误：** `Access to fetch at ... from origin ... has been blocked by CORS policy`

**解决：**
- 确保后端 CORS 配置允许前端域名
- 检查 `backend/src/index.ts` 中的 CORS 设置

### 4. JWT Token 过期

**错误：** `401 Unauthorized`

**解决：**
- 重新登录获取新 token
- 检查 token 是否正确存储在 `localStorage`

---

## 📝 待办事项 / 功能路线图

- [ ] 支持多种复习算法（SM-2、Leitner）
- [ ] 题目标签筛选和搜索优化
- [ ] 数据导出功能（CSV、JSON）
- [ ] 题目完成统计图表
- [ ] 移动端响应式优化
- [ ] 暗色模式支持
- [ ] 邮件提醒功能
- [ ] 题目讨论区集成

---

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 组件使用函数式写法
- CSS 使用主题变量
- API 命名遵循 RESTful 规范

---

## 📄 许可证

本项目仅用于教育目的。

---

## 👥 作者

CS409 Team Project - UIUC

---

## 🔗 相关链接

- [LeetCode](https://leetcode.com/)
- [Alfa LeetCode API](https://github.com/alfaarghya/alfa-leetcode-api)
- [React 文档](https://react.dev/)
- [Express 文档](https://expressjs.com/)
- [MongoDB 文档](https://www.mongodb.com/docs/)

---

## 💡 提示

### 使用 Cursor AI 进行开发

在 Cursor 中打开项目后，可以：

1. **询问架构问题**：
   - "这个项目是如何组织的？"
   - "认证流程是如何工作的？"

2. **请求代码解释**：
   - 选中代码 → Cmd+L → "解释这段代码的作用"

3. **生成新功能**：
   - "添加一个显示每周复习统计的图表"
   - "创建一个导出所有题目为 CSV 的功能"

4. **调试问题**：
   - "为什么这个 API 返回 500 错误？"
   - "如何修复这个 TypeScript 类型错误？"

### 快速导航

| 想要... | 查看文件 |
|---------|---------|
| 修改数据模型 | `backend/src/models/` |
| 添加 API 端点 | `backend/src/routes/` + `controllers/` |
| 修改页面 UI | `frontend/src/pages/` |
| 调整样式主题 | `frontend/src/styles/theme.css` |
| 更改算法逻辑 | `backend/src/controllers/dashboardController.ts` |

---

**🎉 祝你开发愉快！如有问题，欢迎提 Issue！**
