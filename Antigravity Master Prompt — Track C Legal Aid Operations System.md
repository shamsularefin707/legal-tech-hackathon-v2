Build a production-quality prototype for a Bangladesh government legal-aid case management and justice-operations platform.

The product is for **Track C: Justice Operations / System Backbone** of a legal-tech hackathon.

The functional model should be inspired by the operational structure of India's **NALSA Legal Aid Case Management System (LACMS)** and **Legal Aid Defence Counsel System (LADCS)**, while adapting the information architecture, terminology, workflows, and visual language to Bangladesh's legal-aid context.

This is NOT a consumer startup.
This is NOT a chatbot.
This is NOT an AI assistant.
This is NOT a SaaS marketing dashboard.
This is NOT a generic CRUD admin panel.

It should look and behave like a serious government justice-sector information system that could plausibly be used by a District Legal Aid Office.

==================================================
1. CORE PRODUCT
==================================================

Product name:

"জাতীয় আইনগত সহায়তা কার্যক্রম ব্যবস্থাপনা"

Short name in interface:

"আইনগত সহায়তা ব্যবস্থাপনা"

Primary purpose:

A secure internal platform for managing legal-aid cases, applicants, panel lawyers, assignments, deadlines, case progress, workload, reporting, and administrative oversight.

The system must support this lifecycle:

আবেদন গ্রহণ
→ প্রাথমিক যাচাই
→ যোগ্যতা যাচাই
→ মামলা শ্রেণিবিন্যাস
→ অগ্রাধিকার নির্ধারণ
→ আইনজীবী নির্বাচন
→ আইনজীবী নিয়োগ
→ মামলা পরিচালনা
→ শুনানি / মধ্যস্থতা
→ অগ্রগতি পর্যবেক্ষণ
→ ফলাফল নথিভুক্ত
→ মামলা নিষ্পত্তি
→ মামলা বন্ধ
→ প্রতিবেদন ও পরিসংখ্যান

Do not make AI the center of the product.

Automation should assist government officers, not replace their decisions.

==================================================
2. IMPORTANT DESIGN PRINCIPLE
==================================================

The application must feel like a government justice system.

Visual references:

- Bangladesh government portals
- Bangladesh judiciary / government administrative systems
- India NALSA administrative systems
- serious public-sector case-management software
- institutional enterprise software

Avoid:

- startup aesthetic
- SaaS landing-page aesthetic
- futuristic AI aesthetic
- glassmorphism
- excessive rounded cards
- gradients
- neon colors
- purple/blue AI glow
- huge hero sections
- oversized typography
- floating blobs
- excessive icons
- decorative illustrations
- emoji
- fake AI chat windows
- unnecessary animations
- "AI-powered" badges everywhere
- excessive whitespace that makes the system look like a design portfolio

The application should look restrained, official, dense enough for operational work, and highly usable.

Think:

"government case-management terminal"

not:

"startup that raised $4 million".

==================================================
3. LANGUAGE
==================================================

ALL visible interface text must be in Bengali.

Do not use English UI labels.

Examples:

Dashboard → ড্যাশবোর্ড
Cases → মামলা
Applicants → আবেদনকারী
Lawyers → আইনজীবী
Assignments → নিয়োগ
Reports → প্রতিবেদন
Settings → সেটিংস
Search → অনুসন্ধান
Filter → ছাঁকনি
Status → অবস্থা
Priority → অগ্রাধিকার
Deadline → নির্ধারিত সময়সীমা
Notifications → বিজ্ঞপ্তি
Audit Log → কার্যক্রমের রেকর্ড
Security → নিরাপত্তা
User Management → ব্যবহারকারী ব্যবস্থাপনা

Use natural, formal Bangla appropriate for a government office.

Do not translate technical concepts into awkward literal Bengali.

Where necessary, use accepted administrative/legal terminology.

Examples:

"মামলার অবস্থা"
"আইনগত সহায়তার আবেদন"
"প্যানেল আইনজীবী"
"নিয়োগের সুপারিশ"
"যোগ্যতা যাচাই"
"মামলার অগ্রগতি"
"নির্ধারিত সময়সীমা"
"মধ্যস্থতা"
"শুনানির তারিখ"
"নিষ্পত্তির তারিখ"
"দায়িত্বপ্রাপ্ত কর্মকর্তা"

Names of fictional people may be Bengali.

Use realistic Bangladeshi administrative terminology.

==================================================
4. VISUAL SYSTEM
==================================================

Use a restrained government design system.

Color philosophy:

- white background
- very light gray surfaces
- dark charcoal text
- deep institutional blue as primary action color
- restrained green for successful/approved states
- amber for warnings
- red only for genuine critical/security/error conditions
- subtle borders

Do not use gradients.

Do not use excessive shadows.

Do not make every section a floating card.

Use borders and spacing to establish hierarchy.

Typography:

Use a high-quality Bengali UI font such as:

"Noto Sans Bengali"

or another professional Bengali sans-serif.

Use strong typographic hierarchy but keep headings modest.

Avoid oversized 48–72px dashboard numbers.

The interface should feel compact and administrative.

==================================================
5. APPLICATION SHELL
==================================================

Create a persistent government application shell.

Top header:

Left:

বাংলাদেশের জাতীয় প্রতীক / government-style emblem placeholder

Text:

গণপ্রজাতন্ত্রী বাংলাদেশ সরকার

তার নিচে:

জাতীয় আইনগত সহায়তা কার্যক্রম

Right:

বর্তমান ব্যবহারকারী
ব্যবহারকারীর ভূমিকা
বিজ্ঞপ্তি
প্রোফাইল
নিরাপদ প্রস্থান

Do not invent an official logo or falsely represent this as an actual government website.

Use a neutral government-style emblem placeholder if necessary.

Left sidebar:

ড্যাশবোর্ড
মামলা
আবেদন
আবেদনকারী
আইনজীবী
নিয়োগ
শুনানি
সময়সীমা
বিজ্ঞপ্তি
প্রতিবেদন
পরিসংখ্যান
নিরাপত্তা
কার্যক্রমের রেকর্ড
ব্যবহারকারী ব্যবস্থাপনা

Sidebar should be simple and functional.

No giant icon-heavy navigation.

==================================================
6. DASHBOARD
==================================================

Create an operational dashboard for a District Legal Aid Officer.

Header:

"ড্যাশবোর্ড"

Subheading:

"জেলা আইনগত সহায়তা কার্যক্রমের বর্তমান অবস্থা"

At the top show compact statistical summaries:

মোট মামলা
চলমান মামলা
নিষ্পত্তির অপেক্ষায়
সময়সীমা অতিক্রম করেছে
আজকের শুনানি
আইনজীবী নিয়োগ অপেক্ষমাণ

Do not display random fake statistics without indicating that they are demonstration data.

Use a small label:

"নমুনা তথ্য"

or

"ডেমো পরিবেশ"

Main dashboard sections:

1. অগ্রাধিকারপ্রাপ্ত মামলা
2. সময়সীমা সংক্রান্ত সতর্কতা
3. আইনজীবীর কাজের চাপ
4. জেলার মামলার অবস্থা
5. সাম্প্রতিক কার্যক্রম

==================================================
7. CASE PRIORITY
==================================================

Create a transparent case-priority system.

Do NOT claim that an AI decides case priority.

Instead:

"অগ্রাধিকার নির্ধারণ সহায়ক"

The system calculates a score using explicit factors.

Example:

জরুরি অবস্থা
সুরক্ষা / ঝুঁকি
আইনগত সময়সীমা
মামলার বয়স
প্রয়োজনীয়তার মাত্রা

Display the reasons.

Example:

অগ্রাধিকার: উচ্চ

কারণ:
• শুনানির তারিখ নিকটবর্তী
• আবেদনকারীর বিশেষ সহায়তা প্রয়োজন
• মামলা দীর্ঘদিন অনিষ্পন্ন
• নির্ধারিত সময়সীমা নিকটবর্তী

Include:

"কর্মকর্তার সিদ্ধান্ত"

The officer must be able to override the suggested priority.

If overridden, require a reason.

Never hide the reason behind an opaque score.

==================================================
8. CASE LIST
==================================================

Create a serious administrative table.

Columns:

মামলা নম্বর
আবেদনকারীর নাম
মামলার ধরন
উপজেলা / জেলা
অগ্রাধিকার
দায়িত্বপ্রাপ্ত আইনজীবী
বর্তমান অবস্থা
পরবর্তী তারিখ
সময়সীমা
সর্বশেষ কার্যক্রম

Use:

- pagination
- sorting
- filtering
- search
- date filtering
- case-type filtering
- status filtering
- priority filtering
- lawyer filtering

Avoid card-based case lists.

Government officers should be able to scan many records quickly.

==================================================
9. CASE DETAIL
==================================================

Create a detailed case-management screen.

Header:

মামলা নং: LA-2026-001284

Show:

মামলার অবস্থা
অগ্রাধিকার
আবেদনের তারিখ
মামলার ধরন
জেলা
উপজেলা
দায়িত্বপ্রাপ্ত কর্মকর্তা
দায়িত্বপ্রাপ্ত আইনজীবী
পরবর্তী শুনানি
সময়সীমা

Tabs:

সারসংক্ষেপ
আবেদনকারী
মামলার বিবরণ
কার্যক্রম
নথিপত্র
শুনানি
আইনজীবী
সময়সীমা
কার্যক্রমের রেকর্ড

==================================================
10. CASE TIMELINE
==================================================

Create a chronological case timeline.

Example:

০৯ সেপ্টেম্বর ২০২৬
আবেদন গ্রহণ

১০ সেপ্টেম্বর ২০২৬
যোগ্যতা যাচাই সম্পন্ন

১১ সেপ্টেম্বর ২০২৬
আইনগত সহায়তা অনুমোদিত

১১ সেপ্টেম্বর ২০২৬
আইনজীবী নিয়োগের জন্য পাঠানো হয়েছে

১২ সেপ্টেম্বর ২০২৬
আইনজীবী নিয়োগ সম্পন্ন

১৫ সেপ্টেম্বর ২০২৬
প্রথম শুনানির তারিখ নির্ধারিত

Every event must display:

তারিখ
সময়
ব্যবহারকারী
কার্যক্রম
সংক্ষিপ্ত বিবরণ

The timeline must be immutable from the normal user interface.

==================================================
11. LAWYER MANAGEMENT
==================================================

Create a panel-lawyer management module inspired by India's LADCS model.

Lawyer list should include:

নাম
বার/নিবন্ধন নম্বর
জেলা
বিশেষায়ন
অভিজ্ঞতা
বর্তমান মামলার সংখ্যা
সর্বোচ্চ নির্ধারিত কাজের সীমা
প্রাপ্যতা
বর্তমান অবস্থা

Lawyer profile:

ব্যক্তিগত তথ্য
পেশাগত তথ্য
বিশেষায়ন
দক্ষতার ক্ষেত্র
অভিজ্ঞতা
বর্তমান দায়িত্ব
সম্পন্ন মামলা
চলমান মামলা
নিয়োগের ইতিহাস
স্বার্থের সংঘাত
উপস্থিতি
কাজের চাপ

==================================================
12. LAWYER ASSIGNMENT ENGINE
==================================================

Create a transparent recommendation system.

When an officer clicks:

"আইনজীবী নিয়োগ"

show eligible lawyers.

The system should consider:

১. মামলার ধরন ও বিশেষায়ন
২. আইনজীবীর বর্তমান কাজের চাপ
৩. ভৌগোলিক উপযুক্ততা
৪. প্রাপ্যতা
৫. অভিজ্ঞতা
৬. স্বার্থের সংঘাত
৭. পূর্ববর্তী নিয়োগের ভারসাম্য

Display a ranked list.

Example:

প্রস্তাবিত আইনজীবী

১. মোছা. নাজমা আক্তার

উপযুক্ততার কারণ:
• পারিবারিক আইনে বিশেষায়িত
• বর্তমানে ১২টি মামলা
• ঢাকা জেলার জন্য অনুমোদিত
• আগামী ৭ দিনের মধ্যে প্রাপ্য
• স্বার্থের সংঘাত পাওয়া যায়নি

Do NOT write:

"AI selected this lawyer."

Write:

"ব্যবস্থার প্রস্তাব"

and:

"চূড়ান্ত নিয়োগ কর্মকর্তার অনুমোদনসাপেক্ষ।"

The officer must approve the assignment.

==================================================
13. CONFLICT OF INTEREST
==================================================

Implement conflict-of-interest detection.

Before assignment:

Check whether the lawyer:

- previously represented the opposing party
- currently represents the opposing party
- has a related case
- belongs to an organisation with a relevant conflict

If a conflict is detected:

Show a prominent warning:

"সম্ভাব্য স্বার্থের সংঘাত শনাক্ত হয়েছে"

Do not allow silent assignment.

Require the officer to resolve or explicitly document an authorised override.

==================================================
14. WORKLOAD BALANCING
==================================================

Create a workload monitoring system.

Example:

মো. রাকিব হাসান
৩৪টি চলমান মামলা
কাজের সীমা: ৩০
অবস্থা: অতিরিক্ত কাজের চাপ

Show a warning:

"এই আইনজীবীর বর্তমান কাজের চাপ নির্ধারিত সীমার বেশি। নতুন মামলা নিয়োগের আগে পর্যালোচনা প্রয়োজন।"

Do not automatically assign cases merely because the algorithm says so.

==================================================
15. DEADLINE / SLA MONITORING
==================================================

Create a dedicated:

"সময়সীমা পর্যবেক্ষণ"

screen.

Categories:

জরুরি
৭ দিনের মধ্যে
সময়সীমা অতিক্রমের ঝুঁকিতে
সময়সীমা অতিক্রম করেছে

Automated alerts:

৭ দিন আগে → সতর্কতা
৩ দিন আগে → গুরুত্বপূর্ণ সতর্কতা
১ দিন আগে → জরুরি সতর্কতা
সময়সীমা অতিক্রম → ঊর্ধ্বতন কর্মকর্তাকে অবহিত

Display:

মামলা
সময়সীমা
দায়িত্বপ্রাপ্ত কর্মকর্তা
দায়িত্বপ্রাপ্ত আইনজীবী
বর্তমান অবস্থা
প্রয়োজনীয় পদক্ষেপ

==================================================
16. "STUCK CASE" DETECTION
==================================================

Implement an operational feature:

"অচল / দীর্ঘদিন কার্যক্রমবিহীন মামলা"

Detect cases where no meaningful activity has occurred for a configurable number of days.

Example:

মামলা LA-2026-001284

"গত ৮ দিন কোনো কার্যক্রম নথিভুক্ত হয়নি।"

Recommended administrative action:

• আইনজীবীর সাথে যোগাযোগ
• কর্মকর্তার পর্যালোচনা
• শুনানির তারিখ যাচাই
• নথি অসম্পূর্ণ কিনা যাচাই

This is decision support, not automatic legal decision-making.

==================================================
17. DOCUMENT MANAGEMENT
==================================================

Create a secure document module.

Document categories:

আবেদন
পরিচয় সংক্রান্ত নথি
মামলার নথি
আদালতের আদেশ
শুনানির নথি
মধ্যস্থতার নথি
অন্যান্য

Security requirements:

- validate file type
- validate MIME type
- file-size limit
- malware scanning placeholder
- randomised server-side filenames
- do not expose storage paths
- never execute uploaded files
- documents must be accessed through authorised backend endpoints
- no public file URLs
- no predictable document IDs
- maintain access logs
- prevent unauthorised downloads

Never render an uploaded document using an unsafe direct URL.

==================================================
18. SECURITY ARCHITECTURE
==================================================

Security is a core feature.

Do not treat security as a visual page only.

Implement or clearly scaffold:

Authentication
Authorization
Role-based access control
Session management
Audit logging
Data access control
File security
Rate limiting
Input validation
Output encoding
CSRF protection where applicable
Secure headers
Encryption in transit
Encryption at rest
Secrets management
Backup strategy
Account lockout / throttling
Security monitoring

Use secure defaults.

==================================================
19. ROLE-BASED ACCESS CONTROL
==================================================

Roles:

সিস্টেম প্রশাসক
জাতীয় পর্যায়ের কর্মকর্তা
জেলা আইনগত সহায়তা কর্মকর্তা
সহকারী কর্মকর্তা
প্যানেল আইনজীবী
পর্যবেক্ষক

Permissions must be explicit.

Example:

প্যানেল আইনজীবী:

Can:
- view assigned cases
- update assigned case progress
- upload authorised documents
- record hearing information

Cannot:
- view unrelated cases
- assign themselves cases
- change another lawyer's assignments
- access system administration
- modify audit logs
- export the entire database
- access cases outside their authorised scope

District officer:

Can:
- view district cases
- assign lawyers
- review cases
- approve workflows
- access district reports

Cannot:
- modify national system configuration
- erase audit records

Never rely on frontend hiding alone.

Every permission must be enforced server-side.

==================================================
20. OBJECT-LEVEL AUTHORIZATION
==================================================

This is critical.

Prevent IDOR / broken object-level authorization.

If a user accesses:

/cases/123

changing the identifier to:

/cases/124

must NOT grant access.

The backend must verify:

user
+
role
+
permission
+
district scope
+
case relationship

before returning the record.

Apply this to:

cases
applicants
documents
lawyers
hearings
reports
exports
audit logs

==================================================
21. AUDIT LOGGING
==================================================

Create a tamper-resistant audit trail.

Log:

login
logout
failed login
password changes
role changes
permission changes
case creation
case modification
case assignment
case reassignment
case status change
document upload
document download
document deletion request
report generation
data export
user creation
user deactivation
security alerts
administrative overrides

Each log:

তারিখ
সময়
ব্যবহারকারী
ভূমিকা
কার্যক্রম
সম্পদ
সম্পদ নম্বর
পূর্ববর্তী অবস্থা
পরবর্তী অবস্থা
ফলাফল

Audit logs cannot be edited through the normal application.

Provide filtering and search.

==================================================
22. SECURITY MONITORING
==================================================

Create:

"নিরাপত্তা পর্যবেক্ষণ"

Show realistic security events.

Examples:

"একটি ব্যবহারকারীর অ্যাকাউন্টে একাধিক ব্যর্থ প্রবেশের চেষ্টা হয়েছে।"

"একজন ব্যবহারকারী স্বাভাবিকের তুলনায় অস্বাভাবিক সংখ্যক নথি দেখেছেন।"

"একটি প্রশাসনিক অনুমতি পরিবর্তন করা হয়েছে।"

"একটি সন্দেহজনক ডেটা রপ্তানির চেষ্টা শনাক্ত হয়েছে।"

Use severity:

তথ্য
সতর্কতা
গুরুতর

Do not make fake security metrics look like real government data.

Clearly label demonstration data.

==================================================
23. ANOMALOUS DATA ACCESS
==================================================

Create a simple rule-based security monitoring layer.

Examples:

IF user downloads unusually large number of documents
→ security warning

IF user accesses cases outside normal district scope
→ block + log

IF account has repeated failed authentication attempts
→ throttle / temporarily lock

IF administrator changes a sensitive permission
→ audit + notification

IF bulk export is attempted
→ require elevated permission and log event

Do not claim machine-learning anomaly detection unless it actually exists.

==================================================
24. DATA EXPORT SECURITY
==================================================

Bulk export is a sensitive operation.

Create:

"তথ্য রপ্তানি"

with:

রপ্তানির ধরন
সময়সীমা
জেলা
মামলার ধরন
প্রয়োজনীয়তা / কারণ

Require confirmation.

For sensitive exports:

- additional authorization
- audit logging
- reason
- timestamp
- user identity
- generated export identifier

Never provide a generic "Export all data" button to ordinary users.

==================================================
25. REPORTING
==================================================

Create a government-style reporting module.

Reports:

মামলার সংখ্যা
মামলার ধরন অনুযায়ী সংখ্যা
জেলা অনুযায়ী মামলা
মামলার বর্তমান অবস্থা
নিষ্পত্তির হার
গড় নিষ্পত্তির সময়
সময়সীমা অতিক্রম
আইনজীবীর কাজের চাপ
মধ্যস্থতার ফলাফল
মামলা নিষ্পত্তির প্রবণতা

Charts must be restrained.

Prefer:

- simple bar charts
- line charts
- tables

Avoid:

- donut chart overload
- giant colorful infographic dashboards
- decorative graphs

Reports should be printable.

Include:

"প্রতিবেদন প্রস্তুতের তারিখ"

"প্রতিবেদন প্রস্তুতকারী"

==================================================
26. DATA PRIVACY
==================================================

Legal-aid data is sensitive.

Apply privacy-by-design.

Principles:

- collect only necessary information
- restrict access
- minimise data exposure
- separate sensitive fields
- log sensitive access
- mask sensitive identifiers where possible
- protect documents
- prevent unauthorised exports
- define retention rules
- provide controlled deletion/archival workflows

Do not display full sensitive personal information in tables when it is unnecessary.

Example:

Instead of showing a full national ID:

********1234

instead of exposing unnecessary contact information.

==================================================
27. SECURITY PAGE
==================================================

Create a dedicated administrative security page containing:

অ্যাক্সেস নিয়ন্ত্রণ
ব্যবহারকারী ও ভূমিকা
নিরাপত্তা সতর্কতা
কার্যক্রমের রেকর্ড
সেশন পর্যবেক্ষণ
তথ্য রপ্তানি
নথি নিরাপত্তা
ব্যাকআপ অবস্থা

Use serious administrative language.

==================================================
28. LOGIN
==================================================

Create a government-style login page.

No marketing copy.

Header:

গণপ্রজাতন্ত্রী বাংলাদেশ সরকার

জাতীয় আইনগত সহায়তা কার্যক্রম

Title:

নিরাপদ প্রবেশ

Fields:

ব্যবহারকারী নাম
পাসওয়ার্ড

Button:

প্রবেশ করুন

Below:

"এই ব্যবস্থা শুধুমাত্র অনুমোদিত ব্যবহারকারীদের জন্য।"

Do not add:

"Welcome back!"

Do not add:

"Your AI-powered justice journey starts here."

Do not add social login.

==================================================
29. ERROR HANDLING
==================================================

Errors must not expose technical information.

Bad:

"PostgreSQL error: relation users does not exist"

Good:

"তথ্য প্রক্রিয়াকরণে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।"

Security-sensitive errors must not reveal whether an account exists.

==================================================
30. SECURITY HEADERS AND WEB SECURITY
==================================================

Where technically applicable, implement or scaffold:

Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
Secure cookies
HttpOnly cookies
SameSite cookies

Do not put secrets in frontend code.

Do not put API keys in source code.

Do not store authentication tokens in insecure browser storage if a safer architecture is available.

==================================================
31. DATABASE
==================================================

Use a relational database design.

Suggested entities:

users
roles
permissions
user_roles
applicants
cases
case_events
case_statuses
case_categories
lawyers
lawyer_specialisations
lawyer_availability
assignments
hearings
deadlines
documents
notifications
audit_logs
security_events
districts
upazilas
reports
data_exports

Relationships must be properly defined.

Use immutable event records where appropriate.

Do not put everything into one giant JSON object.

==================================================
32. API SECURITY
==================================================

Create a proper API layer.

Every protected API endpoint must verify authorization.

Never trust:

- user ID
- district ID
- role
- case ownership
- lawyer assignment
- permissions

coming from the frontend.

Derive sensitive authorization context from the authenticated server-side session/token.

Validate all input.

Use server-side pagination.

Avoid returning unnecessary fields.

Never return passwords, password hashes, internal secrets, or unnecessary sensitive data.

==================================================
33. SAMPLE DATA
==================================================

Use realistic fictional Bangladeshi data.

Example names:

মো. আব্দুল করিম
মোছা. শারমিন আক্তার
মো. রাকিব হাসান
সাবিনা ইয়াসমিন
নাজমা আক্তার

Example locations:

ঢাকা
গাজীপুর
নারায়ণগঞ্জ
রাজশাহী
চট্টগ্রাম
সিলেট
খুলনা

But clearly mark all data as:

"নমুনা তথ্য"

Do not use real people's personal data.

==================================================
34. CASE CATEGORIES
==================================================

Use realistic legal-aid categories:

ফৌজদারি
দেওয়ানি
পারিবারিক
নারী ও শিশু
জমি ও সম্পত্তি
শ্রম
ভোক্তা অধিকার
উত্তরাধিকার
মানবাধিকার
অন্যান্য

Do not pretend these categories are an exact statutory classification unless sourced.

==================================================
35. STATUS SYSTEM
==================================================

Use:

নতুন আবেদন
প্রাথমিক যাচাই
যোগ্যতা যাচাই
অনুমোদনের অপেক্ষায়
অনুমোদিত
আইনজীবী নিয়োগ অপেক্ষমাণ
আইনজীবী নিয়োগ সম্পন্ন
চলমান
শুনানি চলমান
মধ্যস্থতা চলমান
নিষ্পত্তি হয়েছে
বন্ধ
স্থগিত
স্থানান্তরিত

Use status badges sparingly.

==================================================
36. NOTIFICATIONS
==================================================

Create an official notification center.

Examples:

"মামলা LA-2026-001284-এর শুনানি ৩ দিনের মধ্যে।"

"মামলা LA-2026-001219-এর নির্ধারিত সময়সীমা অতিক্রম করেছে।"

"আপনার কাছে একটি নতুন মামলা নিয়োগের জন্য অপেক্ষমাণ।"

"একটি নিরাপত্তা সতর্কতা তৈরি হয়েছে।"

Avoid generic marketing notifications.

==================================================
37. MOBILE / RESPONSIVE
==================================================

The primary interface is desktop-first because government officers will primarily use desktop computers.

Still support:

- tablet
- smaller laptop
- mobile inspection

Tables may horizontally scroll on smaller screens.

Do not destroy information density just to make everything mobile-card based.

==================================================
38. ACCESSIBILITY
==================================================

Follow accessible design principles.

Requirements:

- sufficient contrast
- keyboard navigation
- visible focus states
- semantic HTML
- labels for inputs
- accessible tables
- screen-reader-friendly status indicators
- do not rely on color alone
- meaningful error messages

Use Bengali text correctly.

==================================================
39. NO AI SLOP
==================================================

This requirement is extremely important.

Do NOT use phrases such as:

"AI-powered"
"Smart Justice"
"Next-generation"
"Revolutionizing justice"
"Intelligent legal ecosystem"
"Future of justice"
"AI-driven insights"
"Unlock justice"
"Seamless experience"
"Empowering citizens"
"Transforming legal services"

unless the phrase is genuinely required by the hackathon submission.

The application should communicate through function, not marketing language.

No chatbot.

No fake AI assistant.

No floating "Ask AI" button.

No generated legal advice.

No unnecessary conversational interface.

==================================================
40. NO VIBE-CODED VISUAL LANGUAGE
==================================================

Do not:

- make every component rounded
- put everything inside cards
- use gradient backgrounds
- use giant icons
- use huge numbers
- use excessive badges
- use excessive shadows
- use excessive animations
- use glass effects
- use decorative blobs
- use stock illustrations
- use emoji
- use fake charts with unexplained numbers
- create unnecessary modal dialogs
- add a dark-mode toggle unless explicitly needed

Use:

- tables
- borders
- tabs
- compact panels
- clear hierarchy
- institutional colors
- precise spacing
- dense information presentation

==================================================
41. DEMO FLOW
==================================================

The prototype must support a complete judge-demo workflow.

Demo:

1. Officer logs in.

2. Dashboard shows:

"১১টি মামলা সময়সীমা অতিক্রমের ঝুঁকিতে"

3. Officer opens:

"অগ্রাধিকারপ্রাপ্ত মামলা"

4. Opens case:

LA-2026-001284

5. Reviews applicant and case information.

6. System shows:

"অগ্রাধিকার: উচ্চ"

with explicit reasons.

7. Officer clicks:

"আইনজীবী নিয়োগ"

8. System presents eligible lawyers.

9. One lawyer is flagged:

"সম্ভাব্য স্বার্থের সংঘাত"

10. Officer cannot silently assign that lawyer.

11. Another lawyer is recommended because of:

specialisation
availability
workload
location
no detected conflict

12. Officer approves assignment.

13. Assignment appears in case timeline.

14. Lawyer workload increases.

15. Deadline monitoring updates.

16. Officer opens:

"সময়সীমা পর্যবেক্ষণ"

17. System highlights an overdue case.

18. Officer opens:

"কার্যক্রমের রেকর্ড"

19. Assignment and case changes are visible.

20. Officer opens:

"নিরাপত্তা পর্যবেক্ষণ"

21. Demonstration security event shows suspicious bulk document access.

This entire flow should feel coherent.

==================================================
42. SECURITY DEMO
==================================================

Include a demonstrable security scenario.

Example:

A lawyer attempts to access a case outside their authorised district.

The API must reject it.

Frontend displays:

"এই মামলাটি দেখার অনুমতি আপনার নেই।"

The event is recorded:

নিরাপত্তা ঘটনা
ব্যবহারকারী
তারিখ
সময়
সম্পদ
কার্যক্রম
ফলাফল: প্রত্যাখ্যাত

Second scenario:

A user attempts excessive document downloads.

System:

- detects threshold
- logs event
- displays security warning
- optionally temporarily blocks the action

This will be part of the hackathon demonstration.

==================================================
43. TECHNICAL QUALITY
==================================================

Do not create fake interactions.

Buttons must perform real actions where feasible.

Forms must validate.

Tables must filter.

Navigation must work.

State changes must persist.

Case assignment must update workload.

Case timeline must update after actions.

Audit logs must reflect actions.

Authorization must be enforced server-side.

Do not implement security as frontend-only visual simulation.

If a real backend cannot be fully implemented, create clean service interfaces and clearly separated mock-data repositories so that the security architecture remains realistic.

==================================================
44. ARCHITECTURE
==================================================

Prefer a clean architecture such as:

Frontend
↓
API / Backend
↓
Authentication + Authorization
↓
Business Logic
↓
Case Management
Lawyer Management
Workflow Engine
Notification Service
Security Monitoring
↓
Database
↓
Audit Log / Document Storage

Keep concerns separated.

Avoid putting all application logic in frontend components.

==================================================
45. GOVERNMENT UX
==================================================

The interface should answer these questions immediately:

"কোন মামলা জরুরি?"

"কোন মামলা আটকে আছে?"

"কোন মামলা সময়সীমা অতিক্রম করেছে?"

"কোন আইনজীবীর কাজের চাপ বেশি?"

"কাকে নিয়োগ করা যেতে পারে?"

"কেন তাকে সুপারিশ করা হয়েছে?"

"কে কোন পরিবর্তন করেছে?"

"কোথায় নিরাপত্তা ঝুঁকি রয়েছে?"

"জেলার সামগ্রিক কার্যক্রম কেমন?"

The dashboard should be an operational tool, not a decorative analytics page.

==================================================
46. IMPORTANT LEGAL / ETHICAL PRINCIPLE
==================================================

The platform assists authorised officers.

It does not:

- decide legal outcomes
- provide binding legal advice
- automatically determine guilt
- automatically determine eligibility without review
- automatically assign lawyers without authorised approval
- replace judicial decision-making

Every consequential automated recommendation must remain:

"কর্মকর্তার অনুমোদনসাপেক্ষ"

==================================================
47. FINAL UI QUALITY BAR
==================================================

Before considering the work complete, inspect every page and remove:

- unnecessary rounded cards
- excessive gradients
- excessive colors
- English UI labels
- fake AI language
- generic SaaS copy
- unnecessary animations
- oversized statistics
- decorative elements
- placeholder lorem ipsum
- fake technical jargon
- inconsistent Bengali terminology

The result should look like a serious government administrative system designed by an experienced public-sector UX team.

It should be believable enough that a government legal-aid officer could understand the interface immediately.

The visual tone should communicate:

নির্ভরযোগ্যতা
নিরাপত্তা
জবাবদিহিতা
প্রশাসনিক শৃঙ্খলা
স্বচ্ছতা

not:

"AI startup".

==================================================
48. IMPLEMENTATION PRIORITY
==================================================

Priority 1:

Authentication
RBAC
Dashboard
Case management
Case detail
Lawyer management
Lawyer assignment
Audit trail

Priority 2:

Priority scoring
Conflict detection
Workload balancing
Deadline monitoring
Stuck-case detection

Priority 3:

Document management
Security monitoring
Reports
Data export controls

Priority 4:

Polish
Accessibility
Responsive behavior
Performance
Error handling

Do not sacrifice security architecture to add decorative features.

Do not add unnecessary features before the core justice-operations workflow works correctly.

==================================================
49. REFERENCE MODEL
==================================================

Use India's NALSA/LADCS operational concepts as inspiration for:

- legal-aid case registration
- case tracking
- lawyer management
- lawyer assignment
- workload monitoring
- district/state-level reporting
- legal-aid operational dashboards

Do NOT copy branding, logos, proprietary assets, or interface designs.

The product should be independently designed for Bangladesh.

==================================================
50. BUILD THE PRODUCT
==================================================

Now implement the complete working prototype.

Start with the application shell, authentication, dashboard, case-management workflow, lawyer management, assignment workflow, RBAC, audit logging, deadline monitoring, security monitoring, and reporting.

Use realistic Bengali sample data.

Keep the interface visually restrained and institutional.

Every screen should feel like part of the same government system.

Do not add anything merely because modern SaaS products commonly have it.

When uncertain between a flashy design and a boring government design, choose the boring government design.

For this project, boring is credibility.