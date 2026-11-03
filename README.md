# CoMET 算术比较预实验 / 計算比較課題

版本：2.0.0；jsPsych 7.3.4。中文版 `zh.html`、日文版 `ja.html`；`index.html` 为语言入口。**这是预实验工程模板，不是经过伦理审批或正式浏览器跨平台验证的研究成品。**

## 1. 当前实验规则

- 自动产生随机 UUID 被试编号，**不提供人工输入编号页面**。不同语言共用实验代码，分别进入页面即可。
- 先向被试显示研究说明和同意按钮（**占位性同意说明**，必须按伦理审批的正式文本替换）。之后为 F / J 操作提供 2 道练习题，练习不计入评分。可通过 `js/config.js` 将 `practiceTrials` 改为 0。
- 6 个难度各 10 道独立题，**不补错题**；无反应时间上限；无答题对错反馈。每道题同时显示 3 个加数的算式和比较数字，判断总和比比较数字**大于还是小于**。按 F（大于）、J（小于）或点击按钮。
- 每次计算的比较数字 C = 真值 A + 偏差 d，d ∈ {-2,-1,+1,+2}。每块 10 题中，方向正负各 5 题，绝对距离 1/2 各 5 题。无相等条件；选项位置固定（大于左，小于右）。
- 计算等级：Lv0 = 单个 2–9 的一位数 + 两个 0，位置随机；Lv2 = 三个一位正整数，无进位；Lv3 = 三个一位正整数，顺次加法总共一次进位；Lv5 = 三个一位正整数，顺次加法总共两次进位；Lv8 = 一个 11–49 的两位数 + 两个一位正整数，顺次加法一次进位；Lv9 = 两个 11–49 的两位数 + 一个一位正整数，顺次加法两次进位。
- **重要方法学定义**：进位次数是“从左到右按屏幕显示顺序依次相加”的十进制进位次数。因为被试可以交换加数顺序，实际心算路线不可观察；此操作定义是一个需要验证的实验假设。两位数的抽样范围 11–49 为当前工程默认值，可据预实验更改。
- 4 种被试间序列随机分配（仅随机分配，不保证小样本中严格人数平衡）：
  A: 0-2-5-8-9-3 / B: 0-2-5-9-8-3 / C: 0-3-5-8-9-2 / D: 0-3-5-9-8-2。
- 每块结束后 3 项 9 点问卷。Lv0 使用绝对难易度、努力、完成意愿；其余等级相对 Lv0 比较，其中难易度与努力 1 = 与 Lv0 相同、9 = 比 Lv0 高很多；完成意愿 1 = 远低于 Lv0、5 = 相同、9 = 远高于 Lv0。**Lv0 与其他等级题目的刻度意义不同，勿直接做绝对评分差异检验。**

## 2. 数据字段

完成后默认自动下载 JSON 和 CSV 两份文件（受浏览器多文件下载限制，可能需要用户许可）。可在结束画面再次点击按钮下载。JSON 包含整个匿名 session；CSV 每条行为事件一行，便于 R/Python 分析。

### session 层
`session_id`（随机 UUID）、`version`、`language`、`sequence_id`、`sequence`、`started_at`、`ended_at`、`complete`、`device`、`config`、`records`、`summary`。

### device 层
浏览器 UA（可能包含广义设备信息）、系统/平台、浏览器语言、时区与偏移、触控点、触控支持、推断的移动端标记、逻辑 CPU 核数（若提供）、内存（若提供）、屏幕和可用屏幕尺寸、视口尺寸、设备像素比、方向、来源域名。**浏览器不一定提供全部信息**；不请求精确定位、摄像头、麦克风或真实硬件标识符。IP 可能由托管服务商按其系统日志策略处理，本实验代码不会把 IP 写入数据记录。

### trial 层
`level`, `block_index`, `trial_in_block`, `trial_global`, `terms`, `arithmetic_expression`, `true_answer`, `intermediate_carry_counts`, `total_carries`, `comparison_number`, `comparison_offset`, `comparison_distance`, `crosses_decade`, `correct_response`, `response_index`, `chosen_response`, `correct`, `rt_ms`, `local_timestamp`, `time_elapsed_ms`, `viewport_width`, `viewport_height`, `visibility_state`, `practice`。此外收集标签页切出/切回及隐藏时长、窗口调整次数。

### rating 层
`level`, `block_index`, `scale_type`, `difficulty`, `effort`, `willingness`, `questionnaire_rt_ms`, `questionnaire_response_raw`, `local_timestamp`, `time_elapsed_ms`。

## 3. GitHub Pages 预实验配置（推荐 Supabase）

GitHub Pages 只能直接托管静态文件，不能直接运行 PHP 或写 MySQL。预实验使用独立的 Supabase PostgreSQL 项目，具有跨域 REST 接口，之后可导出数据为 CSV 再用 R 分析。

1. 创建 Supabase 项目，并在 SQL Editor 运行 `pretest/supabase.sql`。
2. 找到项目 URL (`https://xxxxx.supabase.co`) 和 **publishable key**（或较早项目的 anon public key）。**严禁使用 service_role / secret 密钥**。
3. 修改 `js/config.js`：将 `storageMode` 改为 `supabase`，填写 `supabaseUrl` 和 `supabasePublishableKey`。
4. 把项目**网站代码**上传至 GitHub 仓库（不要上传数据库密码、私人密钥、原始被试数据）。在 Settings → Pages 设置 Deploy from a branch、main / (root)。网站通常为 `https://账号.github.io/仓库名/`。
5. 用自己参与的测试完成 60 题，在实验结束看到“在线保存成功”；在 Supabase SQL Editor 查询 `select session_id, received_at, lang, payload from public.comet_submissions order by received_at desc;`，核对单次完整记录。可用 Dashboard 导出 CSV，或先导出 JSON payload 再在 R 中展开。
6. **务必在真实浏览器运行一次完整测试，确保跨域 POST、浏览器跳转、移动设备、问卷回答以及数据库行确实保存。**

说明：Supabase 开启了 RLS，匿名访客仅有 INSERT 权限，不能 SELECT/UPDATE/DELETE。随机 UUID 是去重主键，重复提交将返回冲突，前端可下载备份。公开插入接口仍可能遭遇垃圾提交，建议实验收集期限制曝光，必要时加服务端代理、速率限制或验证码，正式场景请按机构要求审查安全和伦理合规。

**更低配置的备选**：将 `storageMode` 留为 `local`，让被试在结尾下载 JSON/CSV，再通过其他渠道提交。此方法不自动汇总，存在遗漏风险，不建议用于大规模招募。

## 4. 学校服务器 + FileZilla + phpMyAdmin（正式实验）

1. 向学校服务器管理员申请支持 PHP (>=7.4)、PDO MySQL、MySQL/MariaDB 与 HTTPS 的网页托管空间。**FileZilla 是传输工具，不是建站/建库服务**。
2. 在 phpMyAdmin 创建 UTF8MB4 数据库（或使用已有数据库），执行 `server/schema.sql`。
3. 复制 `server/config.example.php` 为 `server/config.private.php`，填写 PDO DSN / 用户 / 密码。**建议将私有配置文件移动到网页根目录之外，并相应修改 `save.php` 的配置读取路径。** 若无法移动，至少确认 Apache `.htaccess` 生效且该文件无法通过 URL 下载。
4. 将 `index.html`、`ja.html`、`zh.html`、`css/`、`js/`、`server/save.php`、`server/config.private.php` 上传到 HTTPS 网站空间（不要把 `schema.sql`、备份、测试数据公开）。
5. 在 `js/config.js` 将 `storageMode` 改为 `php`，并保持 `phpEndpoint: 'server/save.php'`。同源 HTTPS 通信，不需要 CORS。
6. 用一个测试会话检查数据库 `comet_sessions` 中新行，确保 `payload` 包含试次和问卷。需要进一步展开为关系型试次表，可在今后分析阶段 ETL，或者为不同事件独立建表。
7. 数据主键为 `session_id`，`INSERT IGNORE` 让重复提交幂等。PHP 只接受合法格式、完整会话，使用 PDO 参数化查询。**客户端产生的结果无法防止恶意篡改**；如面向公开招募，仍应按研究伦理和信息安全要求加验证/防刷措施。

部署前：修改正式同意书、研究联系信息、参加报酬与退出政策；将数据库保存期限、存储位置、可能的跨境传输及第三方服务告知被试。检查本校的伦理审批和数据政策。

## 5. 核对与局限

- 量表的 1–9 点在 jsPsych 原始记录中采用索引 0–8，本项目保存时统一 **+1**，并保留原始索引于 `questionnaire_response_raw`。
- `js/config.js` 中配置 `requireDesktop:true` 可拦截大部分手机/平板 UA；浏览器设备检测无法 100% 阻止伪装设备。
- 若用户未允许多文件自动下载，可以在结束页手动下载两份文件。
- 对比距离 ±1/±2 不能完全排除只看个位数、估算或其他捷径；需通过预实验分析是否达成期待的难度梯度。
- `localStorage` 中会写入最近一次尚未完成/进行中的匿名会话作为意外刷新时的临时恢复数据，但**当前版本不提供断点续做**。只有完整实验结束才尝试远程提交，关页丢失、浏览器阻断下载等仍有数据损失风险。
- 若采用完成时提交一次数据，未来正式 Prolific 实验最好增加阶段性服务器检查点、异常退出识别、招募平台 completion code 回传。当前版本不包含 Prolific URL 跳转及 completion code。

## 6. 文件

- `js/generator.js`：独立数学出题器；可用 Node.js 执行 `node tests/test-generator.js`
- `js/app.js`：jsPsych 流程和问卷
- `js/storage.js`：本地下载 / Supabase / PHP 远程保存
- `js/config.js`：保存配置与试次数
- `pretest/supabase.sql`：临时云数据库
- `server/schema.sql`、`server/save.php`：学校 MySQL / PHP

本项目不含 Supabase 项目账号、学校服务器地址或密码，必须由研究者自己配置。需要联网加载 jsPsych CDN。
