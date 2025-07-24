# Chongqing Faith Explorer (重庆信仰探索者)

`chongqing-faith-explorer` 是一个基于 React 的交互式地图应用，展示重庆地区不同宗教（佛教、道教、天主教、伊斯兰教）的寺庙和信仰场所。用户可以通过地图、时间轴和筛选器来探索这些地点的历史变迁和详细信息。

## ✨ 主要功能

- **🗺️ 交互式地图**: 在由 Mapbox 支持的地图上展示寺庙和宗教场所
- **🏷️ 宗教筛选**: 根据不同的宗教类型筛选地点
- **📅 历史时间轴**: 通过时间轴探索不同朝代下各个场所的变迁
- **📋 详细信息**: 查看每个地点的详细描述、历史和照片
- **☁️ 云端数据**: 数据存储在 Firebase Firestore 中，支持实时更新

## 🛠️ 技术栈

- **框架**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **地图**: [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js)
- **路由**: [React Router](https://reactrouter.com/)
- **数据库**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **数据请求**: [TanStack Query](https://tanstack.com/query/latest)

## 🚀 快速开始

### 环境要求

请确保您的开发环境中已安装：
- [Node.js](https://nodejs.org/) (推荐 v18+)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 1. 克隆项目

```bash
git clone https://github.com/your-username/chongqing-faith-explorer.git
cd chongqing-faith-explorer
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境变量配置

在项目根目录创建 `.env` 文件：

```bash
# Firebase 配置
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Mapbox 配置
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGt...
```

### 4. Firebase 项目设置

#### 4.1 创建 Firebase 项目
1. 访问 [Firebase 控制台](https://console.firebase.google.com/)
2. 点击"添加项目"
3. 输入项目名称（建议：`chongqing-faith-explorer`）
4. 按照提示完成项目创建

#### 4.2 设置 Firestore 数据库
1. 在 Firebase 控制台中，选择"构建" > "Firestore Database"
2. 点击"创建数据库"
3. 选择"以测试模式开始"（适合开发阶段）
4. 选择服务器位置（建议选择离您最近的位置）

#### 4.3 获取配置信息
1. 在项目概览页面，点击 Web 图标 (</>)
2. 注册您的应用（应用名称可以是 `chongqing-faith-explorer`）
3. 复制显示的配置信息到 `.env` 文件中

### 5. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:8080` (或另一个可用端口)上运行。

## 📊 数据导入

### 方式一：Web 界面导入（推荐）⭐

1. 启动开发服务器后，访问：`http://localhost:8080/import-data`
2. 点击"开始导入"按钮
3. 等待成功提示

### 方式二：浏览器控制台

1. 打开应用主页
2. 按 F12 打开开发者工具
3. 在控制台中运行：
   ```javascript
   window.importTemples()
   ```

### 数据结构

每个寺庙文档包含以下字段：

| 字段名 | 类型 | 示例 |
|--------|------|------|
| `id` | string | "cq1" |
| `name` | string | "重庆大足石刻宝顶山石窟" |
| `location` | string | "重庆市大足区" |
| `religion` | string | "buddhism" |
| `establishedYear` | number | 1179 |
| `status` | string | "active" |
| `description` | string | "大足石刻是重庆大足区..." |
| `imageUrl` | string | "https://images.unsplash.com/..." |
| `coordinates` | geopoint | lat: 29.7056, lng: 105.7242 |
| `relatedPeople` | array | ["赵智凤"] |
| `relatedEvents` | array | ["1179年开凿", "1999年列入世界遗产"] |

## 🏛️ 架构概览

本项目采用现代化的组件驱动架构：

### 核心组件

- **`pages/Index.tsx`**: 应用的主容器组件，负责数据获取和状态管理
- **`components/MapView.tsx`**: 核心的交互式地图组件
- **`components/FilterPanel.tsx`**: 筛选面板组件
- **`components/DetailPanel.tsx`**: 详情面板组件
- **`services/templeService.ts`**: Firestore 数据服务

### 数据流

1. **数据获取**: 使用 TanStack Query 从 Firestore 获取数据
2. **状态管理**: React Hooks 管理本地状态
3. **数据流**: 遵循单向数据流，状态向下传递，事件向上冒泡

## 📂 目录结构

```
chongqing-faith-explorer/
├── public/              # 静态资源
├── src/
│   ├── components/      # 可复用的 React 组件
│   │   ├── ui/          # shadcn/ui 基础 UI 组件
│   │   ├── DetailPanel.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Header.tsx
│   │   ├── MapView.tsx
│   │   └── TimeSlider.tsx
│   ├── data/            # 静态数据文件
│   ├── hooks/           # 自定义 React Hooks
│   ├── lib/             # 工具函数和配置
│   ├── pages/           # 页面级组件
│   ├── scripts/         # 辅助脚本
│   ├── services/        # API 服务
│   ├── types/           # TypeScript 类型定义
│   ├── App.tsx          # 根组件
│   └── main.tsx         # 应用入口
├── .env.example         # 环境变量示例
├── package.json         # 项目依赖
└── README.md           # 项目文档
```

## 🧪 功能测试

### 基本功能验证

访问 `http://localhost:8080` 并检查：

- ✅ 地图正常加载显示重庆区域
- ✅ 9 个寺庙标记正确显示（不同宗教使用不同颜色）
- ✅ 点击标记显示详情面板
- ✅ 筛选器和年份控制正常工作
- ✅ 底部显示"数据来源: Firestore"

### 数据验证

在 Firebase 控制台中确认：

- ✅ `temples` 集合已创建
- ✅ 9 个文档（cq1-cq9）
- ✅ 坐标数据正确显示为 geopoint 类型

## 🚨 常见问题

**Q: 导入失败怎么办？**
A: 检查：
- Firebase 配置是否正确
- 网络连接是否正常
- Firestore 安全规则是否允许写入

**Q: 地图不显示标记？**
A: 检查：
- 浏览器控制台是否有错误
- Firestore 数据格式是否正确
- Mapbox token 是否配置正确

**Q: 如何添加新的寺庙数据？**
A: 
1. 编辑 `src/data/templesData.ts` 文件
2. 重新访问 `/import-data` 页面导入
3. 或直接在 Firebase 控制台中添加

## 🔐 安全建议

- **生产环境**: 设置适当的 Firestore 安全规则
- **API 密钥**: 使用环境变量管理敏感信息
- **版本更新**: 定期更新 Firebase SDK 版本

## 🤝 贡献指南

1. Fork 此仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Firebase](https://firebase.google.com/) - 云数据库服务
- [Mapbox](https://www.mapbox.com/) - 地图服务
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Unsplash](https://unsplash.com/) - 图片资源
