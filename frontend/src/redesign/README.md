# IDOL Redesign

New IDOL pages for the frontend revamp. Members on the `idol` subteam see the latest redesign work
(with a "Try new UI" toggle in the sidebar). Everyone else sees the released site.

## Where code goes

- `design-system-2026/`: general UI components (buttons, inputs, tokens).
- `redesign/`: new IDOL pages and the new app layout, plus the temporary preview logic
  (`preview.tsx`).
- `pages/`: routes only. Each page renders the old page (not worked on yet), the new page (when released), or `previewPage(Old, New)` (as we work).
- `components/`: the old UI. We can cleanup after release.

## Page Redesign Process

**1. During Development.** Build the new page in `redesign/`, then switch the page file. Consider this example:

```tsx
// In pages/forms/coffeeChats.tsx
import OldCoffeeChatsForm from '../../components/Forms/CoffeeChatsForm/CoffeeChatsForm';
import CoffeeChatsForm from '../../redesign/Forms/CoffeeChatsForm/CoffeeChatsForm';
import { previewPage } from '../../redesign/preview';

export default previewPage(OldCoffeeChatsForm, CoffeeChatsForm);
```

Members still see the old page, and IDOL can see the new one.

If a change doesn't fit `previewPage` (e.g. the layout in `pages/_app.tsx`), use `usePreview()` to pick old or new, and keep only the new version at release.

**2. Release to members.** Delete the old version from the page file:

```tsx
import CoffeeChatsForm from '../../redesign/Forms/CoffeeChatsForm/CoffeeChatsForm';

export default CoffeeChatsForm;
```

When we release any subset of pages to the team, we just make the above changes to each page in 1 PR.

**3. Clean up.** Once pages are released, delete the old files they no longer use. Check nothing else still imports them first. This should be contained into 1 PR probably.

## Conventions

We should follow these to be clean:

- If possible, mirror the old component's path in `redesign/`: `components/Forms/CoffeeChatsForm/` -> `redesign/Forms/CoffeeChatsForm/`.
- Use the same file and component names as the old version. Old versions get an `Old` prefix only where the page file imports them.
- Only check preview in `pages/_app.tsx` and `pages/*`, not inside components.
- New code should use components defined in `design-system-2026/`
- Backend changes related to redesign should be held off on until later (this does not affect other unrelated tasks)
