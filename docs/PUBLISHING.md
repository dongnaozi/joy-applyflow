# Joy ApplyFlow 1.0.1 发布检查

目标仓库：公开 GitHub 仓库 `dongnaozi/joy-applyflow`。版本标签：`v1.0.1`；Release
标题：`Joy ApplyFlow 1.0.1`。此文档是发布流程，不代表当前版本已上传。

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
5. 确认 CI 通过，再创建 `v1.0.1` 标签和标题为 `Joy ApplyFlow 1.0.1` 的 GitHub Release。
   发布说明采用已完成的功能与实际检查结果；附件只从审核过的跟踪文件生成，避免
   将本地整个工作目录打包。发布后在未导入个人资料的新浏览器配置中验证启动。

## 在现有仓库发布

安装官方 GitHub CLI 并通过 `gh auth login` 登录。先确认 origin 指向目标仓库，更新版本元数据，运行 `python scripts/check.py`，再提交审阅过的公开文件。应用 1.0.1 继续使用 version-1 个人备份，不改浏览器存储键。

```powershell
git fetch origin --tags
git push origin main
```

确认当前提交的 CI 通过，再创建未占用的新标签并从提交生成附件：

```sh
git tag -a v1.0.1 -m "Joy ApplyFlow 1.0.1"
git archive --format=zip --prefix=joy-applyflow-1.0.1/ --output=../joy-applyflow-v1.0.1.zip v1.0.1
git push origin v1.0.1
gh release create v1.0.1 ../joy-applyflow-v1.0.1.zip --repo dongnaozi/joy-applyflow --verify-tag --title "Joy ApplyFlow 1.0.1" --notes-file docs/RELEASE-v1.0.1.md
```

在临时目录解压并检查启动和资源，再核对公开 Release 的标签、提交与附件。`v1.0.0` 等旧标签保持原状；版本已存在时先检查状态，不强推或覆盖附件。

`scripts/publish.ps1` 是首次创建新仓库的可选入口，会拒绝已有 remote；升级现有仓库使用上面的流程。GitHub 网页登录与 Git/API 凭据是不同的连接状态，发布需要相应授权。
