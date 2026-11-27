# 🎨 SplitScape - Kinde Custom UI Starter Template

A fully customizable UI starter template built with React Server Components and Kinde's Custom UI feature. Design your auth flows with complete control over the UI.

## Preview

View [live demo]()

![SplitScape](image.png)

## Features

- 🎯 Full control over auth UI design and layout
- 🚀 Built with React Server Components
- 🔒 Kinde Authentication integration
- 📱 Responsive design out of the box

## Prerequisites

- npm or yarn
- A Kinde account with Custom UI feature enabled

## Quick Start

In your project root directory, use the Kinde CLI and run

```bash
kinde custom-ui --template splitscape
```

## Customization Guide

### Page Layouts

The template includes customizable layouts for all authentication pages:

- Sign In
- Sign Up
- Password Reset
- Email Verification
- Multi-factor Authentication
- Social Authentication
- Error Pages
- And more...

Each layout can be customized in the `kindeSrc/enviroment/pages/(kinde)` directory.

### Email Templates

The emails Kinde sends can be designed here too, in the same SplitScape style as the sign-in pages. Kinde's Git sync deploys every `kindeSrc/environment/emails/<key>/email.tsx` it finds, and renders it whenever that email is sent.

| Folder | Sent when |
| --- | --- |
| `sign_up_code` | A user confirms their email address at sign-up or signs in with an email code |
| `password_reset` | A user asks to reset their password |
| `mfa_code` | A user signs in with email as their second factor |
| `organization_invitation` | Someone is invited to join an organization |

Custom templates are used only when the environment sends email through your own email provider and Enhanced emails is active. If a template fails to render, Kinde sends its built-in email instead.

Each template:

- exports `emailSettings` (leave out `orgCode` for an environment-wide template; add `locales: ["en", ...]` to limit the languages it renders)
- default-exports a function that receives the email event and returns `{ subject, html, text }`; all three are required

The event carries the recipient (`event.request.email`: `to`, `code`, `expiresInMinutes`, `link`, `recipient.firstName`), the language (`event.request.locale.lang`) and your branding (`event.context.branding`, plus `event.context.organization` when the email belongs to an organization). Templates have no network access: `kinde.*` bindings such as `kinde.fetch` are removed.

**Customizing**

- **Wording** lives in each `email.tsx`. `sign_up_code` uses the copy you edit on Kinde's Email content page and falls back to the English in the file; the other templates use their own wording and take only the disclaimer from Kinde.
- **Colors and logo** come from your Kinde brand settings (email button and link colors, logo). When none are set, the templates fall back to the SplitScape palette in `_shared/copy.ts`.
- **Layout** lives in `_shared/layout.tsx`: tables and inline styles only, because most email clients ignore stylesheets. `_shared/codeEmail.tsx` is the layout the three code emails share.
- **Per-organization variants** go in a subfolder of the email's folder, with the organization's code as `orgCode` in `emailSettings`. They need the advanced organizations entitlement, and the organization must exist in the environment the repository syncs to. The `org_0680611efdb` folders are an example: each one reuses its environment template's wording and swaps in a dark panel with an "Organization template" badge (`_shared/organizationVariant.ts`), so you can see which template rendered an email. Change the folder name and `orgCode` to use them for your own organization.

Shared code must stay in `_shared` (or any folder without an `email.tsx`): Kinde treats every `email.tsx` under `emails/` as a template, and names it after its first folder.

Check the templates with `npm run typecheck:emails`.

## Project Structure

```
📂 splitScape
├── 📂 kindeSrc
│   ├── 📂 environment
│   │   ├── 📂 pages
│   │   │   └── 📂 (kinde)
│   │   │       └── 📂 (default)
│   │   │           └── ⚛️ page.tsx
│   │   └── 📂 emails
│   │       ├── 📂 _shared
│   │       │   ├── ⚛️ layout.tsx
│   │       │   ├── ⚛️ codeEmail.tsx
│   │       │   ├── 📄 copy.ts
│   │       │   ├── 📄 organizationVariant.ts
│   │       │   └── 📄 types.ts
│   │       ├── 📂 sign_up_code
│   │       │   ├── ⚛️ email.tsx
│   │       │   └── 📂 org_0680611efdb
│   │       │       └── ⚛️ email.tsx
│   │       ├── 📂 password_reset
│   │       │   ├── ⚛️ email.tsx
│   │       │   └── 📂 org_0680611efdb
│   │       │       └── ⚛️ email.tsx
│   │       ├── 📂 mfa_code
│   │       │   ├── ⚛️ email.tsx
│   │       │   └── 📂 org_0680611efdb
│   │       │       └── ⚛️ email.tsx
│   │       └── 📂 organization_invitation
│   │           ├── ⚛️ email.tsx
│   │           └── 📂 org_0680611efdb
│   │               └── ⚛️ email.tsx
│   ├── 📂 layouts
│   │   └── ⚛️ default.tsx
│   ├── 📂 styles
│   │   └── 📄 styles.ts
│   └── ⚛️ root.tsx
└── 📄 kinde.json

```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Need help? Here are some resources:

- Check out the [video demos](https://www.loom.com/share/folder/4398af02bbde4f498952ab4654a331a3) for implementation examples
- Join the [Kinde Community](https://community.kinde.com)
- Open an issue on GitHub
- Review the [Kinde documentation](https://docs.kinde.com)
