# Joy ApplyFlow 1.0 发布检查

目标仓库：公开 GitHub 仓库 `joy-applyflow`。版本标签：`v1.0.0`；Release
标题：`Joy ApplyFlow 1.0`。此文档是发布操作清单，不代表仓库或 Release 已创建。

1. 在用于公开发布的干净目录操作，运行 README 中的完整检查。确认首次启动使用
   空白申请档案，浏览器中导入的简历、研究方向和申请记录不会成为仓库种子。
2. 在暂存前、暂存后各检查一次文件清单：

   ```powershell
   git status --short --untracked-files=all
   git ls-files
   git diff --cached --stat
   git diff --cached --name-only
   ```

3. 核验忽略规则实际生效；这些路径应命中 `.gitignore`：

   ```powershell
   git check-ignore -v .runtime/probe.json .env private/probe.pdf exports/probe.json
   ```

   `.gitignore` 不会移除已经被跟踪的文件。逐一核对 `git ls-files`：不得包含私人
   PDF、DOC/DOCX、简历、邮箱导出、账号凭据、API 密钥、浏览器存储、申请数据、
   运行缓存、日志、截图、备份或开发者绝对路径。只暂存逐项核对过的公开文件。
4. 检查公开种子：导师姓名、单位、论文题录及短证据保留出处；`literature-seed.json`
   中不得有出版社完整摘要、摘要译文或全文。核对 `THIRD_PARTY_NOTICES.md` 以及
   `dist/vendor/` 内所有许可证均进入发布包。
5. 确认 CI 通过，再创建 `v1.0.0` 标签和标题为 `Joy ApplyFlow 1.0` 的 GitHub Release。
   发布说明采用已完成的功能与实际检查结果；附件只从审核过的跟踪文件生成，避免
   将本地整个工作目录打包。发布后在未导入个人资料的新浏览器配置中验证启动。

## 可选 GitHub CLI 发布入口

在已安装官方 GitHub CLI 并通过 `gh auth login` 登录后，可在完成本地提交和 `v1.0.0` 标签的仓库内运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/publish.ps1
```

脚本读取 `repository.json` 中的仓库名、简介、五个 Topics 和 Release 名称。它拒绝已有 remote、同名现有仓库和未提交修改，避免误覆盖已有项目。它不会帮你创建账号、获取令牌或把个人文件加入 Git。公开仓库创建或推送成功一部分后若发生网络错误，请先核对远端状态再继续，不能把重试理解为回滚。
