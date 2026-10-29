# Joy ApplyFlow

**中文简介**

Joy ApplyFlow 是由 Joy 构建的本地博士申请工作台，帮助申请者整理导师与院校信息、追踪研究文献、比较简历与导师研究方向的关键词，并通过申请清单记录准备进度。支持可选的 Ollama 本地模型；个人背景、简历文字和申请记录保存在当前浏览器，公开代码与私有数据分开管理。

**English overview**

Joy ApplyFlow is a local PhD application workbench built by Joy. It helps applicants organize supervisors and universities, follow research literature, compare CV keywords with supervisors' research interests, and track preparation with application checklists. Optional Ollama integration supports local models. Personal profiles, extracted CV text, and application records are stored in the current browser, separate from the public code.

**Release 1.0.1** adds a larger sourced supervisor library, QS 2026 top-100 discovery, local Obsidian vault integration, nine color themes, and a simpler interface with Times New Roman English text. Draft versioning and school deadline reminders remain planned. The current interface is primarily Chinese.

第二版收录 **130 位导师**，其中 **121 位来自 QS 2026 前 100 院校，覆盖 79 校**（各研究方向合计）。前 100 校均列入收录范围，尚未核实的学校显示“待补充”。不同研究方向与筛选条件会显示不同数量。

## 现在可以做什么

- 查看有来源的导师档案、精选论文、学术关系和 QS 2026 综合排名；默认探索前 100 院校，可切换全部已收录院校，通过研究方向关键词同步筛选。
- 手动添加导师，或从公开官网提取资料，再用可选的本机 Ollama 整理待核对的导师条目。
- 在浏览器本机解析 PDF、DOCX、TXT / Markdown 简历，用关键词比较研究方向覆盖率。
- 收藏导师、勾选准备事项和逐位导师任务，记录申请阶段、跟进日期与备注。
- 读取已配置期刊的 RSS / Atom 文献更新，筛选并收藏论文。
- 导出、导入个人 JSON 备份，导出申请清单 CSV。
- 选择九种工作台配色，按个人称呼生成头像；外观设置保存在本机。
- 在 Obsidian 板块连接本地仓库、预览并增量同步资料、保留个人阅读笔记，也支持双链 Markdown ZIP 与原生打开链接。配置见 [Obsidian 联动](docs/OBSIDIAN.md)。

关键词覆盖率不是录取概率。公开档案、排名、关系和论文样本不构成完整数据库；申请前请回到学校、项目和导师官网确认最新信息。

院校页列出 QS 2026 前 100 的完整院校范围，以及每校当前方向的收录情况。没有条目的学校显示“待补充”；同校相关导师不设固定名额，官网核实后继续增加。排名年度固定显示，未将 2027、学科排名或研究所名次混入。收录规则见 [导师收录](docs/DISCOVERY.md)。

## 快速启动

需要 **Python 3.10 或更新版本**和现代浏览器。应用服务仅使用 Python 标准库，无需 `pip install`、`npm install` 或前端构建。

从本仓库的 **Code → Download ZIP** 下载并解压，或克隆到本地，然后在项目目录运行：

```sh
python server.py
```

若系统将 Python 命令命名为 `python3`，使用 `python3 server.py`。然后打开 [http://127.0.0.1:8792/](http://127.0.0.1:8792/)。在终端按 `Ctrl+C` 停止服务。

Windows 也可以双击 `打开工作台.cmd` 或 `start-workbench.cmd`；结束使用后双击 `停止工作台.cmd`。第一次启动前请安装 Python，并将其加入 PATH。保留整个项目目录，不能只复制 HTML 文件。

普通浏览、简历解析和清单管理可在本机使用。获取 RSS、识别公开导师官网及打开外部原文需要联网。

### 从第一版升级

先在旧版导出个人 JSON 备份，再解压第二版到新文件夹并停止旧服务。用原来的浏览器和 `http://127.0.0.1:8792/` 打开新版，原有浏览器记录可继续使用；更换浏览器或端口时，使用 JSON 备份导入。第二版继续兼容 `version: 1` 的备份。Obsidian 请先备份仓库，再连接目录并预览同步；旧版无受管标记的同名笔记会保留并提示冲突。

## 可选：本机 Ollama

手动安装并启动 Ollama，然后自行下载一个受支持的模型：

```sh
ollama pull deepseek-r1:1.5b
```

或者：

```sh
ollama pull deepseek-r1:7b
```

在工作台的模型设置中选择已下载的模型并测试连接。较大的模型需要更多内存，首次加载也可能较慢。应用只连接本机 `localhost:11434`，不会自动安装 Ollama 或下载模型；不配置 Ollama 也能使用手动添加导师和其他核心功能。导师官网识别仅向本机模型提供公开页面内容，简历匹配使用浏览器内的关键词规则。

## 配置与个人数据

[.env.example](.env.example) 列出可配置项。需要修改时，将它复制为同目录的 `.env`，再编辑其中的值；进程环境变量优先于 `.env`。可设置端口、私有目录及默认模型；以该文件和 [数据说明](docs/DATA.md) 为准。服务只允许绑定 `127.0.0.1`，用于单人本机使用。

个人背景、简历文字、自建导师、收藏、勾选状态、阶段、跟进日期和备注保存在**当前浏览器的 localStorage**。它们不会自动写成项目文件，也不会同步到其他设备。清除浏览器站点数据会删除这些记录，请定期使用“导出 JSON 备份”。

服务运行时缓存和日志与公开网页分开保存。Windows 默认私有目录位于 `%APPDATA%\joy-applyflow\private`；可用 `APP_PRIVATE_DIR` 指定其他仓库外目录。该目录不是浏览器个人记录的备份。请把简历原件、邮件、申请材料和导出的备份放在仓库外；需要在仓库内手动保存文件时，仅使用已忽略的 `data/private/`，且不要放入 `dist/`。`data/private/` 不能作为 `APP_PRIVATE_DIR`。

迁移原有工作台时，先在原页面导出 JSON，再到新页面导入。导入会在确认后**替换当前浏览器的个人记录**，建议先备份。相同浏览器、相同 `http://127.0.0.1:8792` 地址会沿用原 localStorage；更换端口、主机名、浏览器或设备会形成不同的存储空间，需要导入。不要同时运行两个占用相同端口的副本。

## 仓库结构

```text
joy-applyflow/
├── dist/                   # 直接运行的 HTML、CSS、JavaScript、公开种子数据与第三方组件
├── server.py               # 本机静态服务、RSS 接口、模型与导师识别接口
├── config.py               # 环境配置与私有目录边界
├── mentor_import.py        # 公开导师页面抓取、证据提取与本机模型整理
├── ollama_client.py        # 本机 Ollama 客户端
├── literature_sources.json # 公开 RSS / Atom 来源配置
├── examples/               # 完全虚构的 JSON 示例
├── docs/                   # 架构、数据边界与路线图
└── check-*                 # 针对现有功能的验证脚本
```

`dist/` 中的 JavaScript 就是当前源码，没有另一个待构建的 `src/` 目录。现有模块边界见 [架构说明](docs/ARCHITECTURE.md)。示例包括可导入的 [虚构备份](examples/backup.example.json)、[导师条目](examples/mentor.example.json)和[研究方向配置](examples/research.example.json)；后两项是字段参考，并非独立文件导入入口。

[申请规划设计示例](examples/application-plan.example.json) 仅说明未来联系日志、截止日期、材料与草稿版本的数据关系，**不能导入当前版本**，也不代表这些功能已实现。

## 后续计划

| 版本 | 计划范围 | 当前状态 |
| --- | --- | --- |
| 1.0 | 导师研究、文献、背景匹配、清单与备份 | 已实现 |
| 1.0.1 | QS 前100扩库、Obsidian 联动、九色主题与精简界面 | 已实现 |
| 1.1 | 套磁 / 邮件联系日志、学校与项目截止日期、提醒 | 计划中 |
| 1.2 | 材料状态追踪、申请文书草稿的本地版本管理 | 计划中 |
| 1.3 | 可选持久化方案，评估 SQLite 与可迁移备份 | 计划中 |

当前跟进日期只是手动日期字段，不提供通知或定时提醒。当前备注不等同于邮件联系日志或文书版本库。详见 [路线图](docs/ROADMAP.md)。

欢迎通过 issue 和 pull request 提交改进，先阅读 [贡献指南](CONTRIBUTING.md)。版本记录见 [CHANGELOG](CHANGELOG.md)。

## 许可证与来源

项目原创代码采用 [MIT License](LICENSE)，Copyright (c) 2026 Joy。`dist/vendor/` 内组件保留各自许可证，包括 Tabler、PDF.js 和 JSZip。公开学术元数据保留来源链接；项目许可证不授予第三方论文、摘要、网页内容或品牌的额外权利。发行版不附带个人申请数据或批量出版社摘要。

GitHub repository description:

> A personal and modular PhD application workbench built by Joy. Track supervisors, drafts, and deadlines with ease.

GitHub topics: `phd-application`, `productivity`, `workbench`, `scholarship`, `admissions-tracker`.

## Development checks

验证需要 Git、Python 3.10+ 和 Node.js 22+，无需安装项目运行依赖：

```sh
python scripts/check.py
```

CI 执行相同的离线检查，不连接 Ollama 或出版社网站。可选的 `check-profile-pdf.mjs` 额外需要自行安装 `pdf-lib` 与 `@napi-rs/canvas`，不属于默认检查。发布前检查详见 [PUBLISHING.md](docs/PUBLISHING.md)，第三方许可证清单见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
