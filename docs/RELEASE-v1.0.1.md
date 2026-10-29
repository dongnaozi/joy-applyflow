## Joy ApplyFlow 1.0.1

第二版将导师研究、申请准备与本地 Obsidian 笔记接起来，保留本机运行和个人数据独立存储的方式。

### 本版更新

- **导师扩充**：新增 106 位有来源的研究者，资料库共 130 位；其中 121 位归属 QS 2026 综合排名前 100 院校，覆盖 79 校，各研究方向有交集。
- **QS 前 100 范围**：院校页列出完整 100 校，支持研究方向、地区和收录状态筛选；尚无核实条目的学校显示“待补充”，同校不设固定人数。
- **Obsidian 联动**：连接本地仓库，预览变化后增量写入；保留个人笔记、跳过冲突，支持阅读模板、双链、笔记回读、ZIP 导出和原生打开链接。
- **精简界面**：九种可保存配色、称呼头像、院校与文献筛选整理、Times New Roman 英文字体，以及 CO2 等普通上下标显示。
- **保留已有工作流**：简历本机解析、申请勾选清单、公开导师主页识别、可选 Ollama DeepSeek 模型和 JSON 备份。

### 安装与升级

下载 `joy-applyflow-v1.0.1.zip` 并完整解压。安装 Python 3.10 或更新版本，在项目目录运行 `python server.py`；Windows 也可双击 `打开工作台.cmd`。打开 `http://127.0.0.1:8792/`，运行时无需 npm 或前端构建。

升级前在旧版导出个人 JSON 备份，停止旧服务后启动新版。使用原来的浏览器和地址可保留浏览器记录；更换浏览器或端口时导入备份。应用 1.0.1 继续兼容 `version: 1` 的备份。发布包不包含个人简历、申请记录、Obsidian 笔记或本机配置。

Obsidian 目录连接适用于本机 Chrome / Edge，刷新后需重连。旧版无受管标记的同名笔记不会自动覆盖；其他浏览器可使用 ZIP 导出。

### 验证与范围

运行 `python scripts/check.py` 验证公开文件边界、资源完整性、方向筛选、申请进度、Obsidian 冲突保护及显示规则。源码包另经解压、启动和 HTTP 资源检查。

导师、排名和论文均保留来源，但当前资料并非全体导师或完整发表量数据库。学校截止日期提醒、邮件联系日志及文书版本管理仍在路线图中。

## English

Version 1.0.1 adds a sourced library of 130 supervisors, QS 2026 top-100 discovery, local Obsidian vault integration, nine saved themes and a simpler interface. Of the supervisors, 121 are associated with 79 universities in the chosen top-100 universe across the supported research directions. Unverified university coverage remains pending.

Obsidian synchronization previews changes before writing, preserves personal notes outside managed sections and skips conflicts. Reading templates, linked Markdown ZIP export and native note links are included. Directory access works in local Chrome / Edge sessions and reconnects after reload.

Run with Python 3.10+ using `python server.py`; no npm installation or frontend build is required. Export a personal backup before upgrading. Existing version-1 backups remain compatible, and private applicant data is excluded from this release. Deadline reminders, structured outreach logs and draft versioning remain planned.
