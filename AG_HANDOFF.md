# AG Handoff: Wild Botanix Hero + UI Finish

## Current priority
Finish the Wild Botanix storefront polish from the live local build at `http://127.0.0.1:4173`.

The user wants the next finisher pass to happen in-browser with side-by-side comparison against the reference sites.

## What the user explicitly wants

### Hero
- Use the exact uncropped hero image the user attached in chat.
- Do not crop the hero image.
- Keep the women clearly visible on the right-hand side.
- Put the hero text directly over the image.
- Do not put the hero text inside a card.
- Make the hero text smaller than the oversized current version.
- The text styling should feel premium, closer to the entrepreneurship site references.
- Use the entrepreneurship-style headline treatment rather than plain white default text.

### Typography direction
- Local reference found:
  - `C:\Users\tauru\OneDrive\Desktop\Development & AI Projects\entrepreneurity-website-v2\knowledge\web_design_bible_upgraded.md`
  - `C:\Users\tauru\OneDrive\Desktop\Development & AI Projects\entrepreneurity-website-v2\knowledge\App_Design_Bible_Upgraded.md`
  - `C:\Users\tauru\OneDrive\Desktop\agent brain os website\index.html`
  - `C:\Users\tauru\OneDrive\Desktop\agent brain os website\styles.css`
- Practical pairing already applied in code:
  - `Sora` for hero headline
  - `Manrope` for supporting copy

### Global visual direction
- Darker botanical background system is desired.
- Scenic backgrounds should feel layered, not flat.
- Motion should be subtle and atmospheric, not pushy hover zoom.

## Important blocker
- The exact untouched hero source image from chat is not available as a normal local file path in the repo.
- The current hero asset is the best local-accessible fallback built from the previous reference material, but it is not the exact original file the user attached.
- If you can access the chat attachment directly through your browser/UI workflow, replace the current hero asset with that exact image.

## Files already changed for this pass
- `C:\Users\tauru\OneDrive\Desktop\wild botaniks website\src\pages.tsx`
- `C:\Users\tauru\OneDrive\Desktop\wild botaniks website\src\index.css`
- `C:\Users\tauru\OneDrive\Desktop\wild botaniks website\src\siteData.ts`
- `C:\Users\tauru\OneDrive\Desktop\wild botaniks website\public\branding\wild-botaniks-hero-fullscene.png`

## Current hero asset path
- `C:\Users\tauru\OneDrive\Desktop\wild botaniks website\public\branding\wild-botaniks-hero-fullscene.png`

## What to inspect first in browser
1. Homepage hero at `http://127.0.0.1:4173`
2. Confirm the text is no longer inside a card.
3. Confirm headline size is calmer.
4. Replace the current fallback hero image with the exact chat attachment if your tooling can access it.
5. Fine-tune headline styling, overlay density, spacing, and CTA alignment in-browser.

## User taste notes
- They are highly sensitive to anything that feels templated.
- They do not want flat white backgrounds.
- They want image-led composition with text placed deliberately over imagery.
- They prefer a premium, neat, high-control feel rather than generic ecommerce output.
