# THESE MONSTERS EAT CARBON >

A food finder for the carbon-eating monsters that came to Earth.

## Built with:

- Convex
- [Convex Auth](https://labs.convex.dev/auth) for your authentication implementation
- [React](https://react.dev/) as your frontend (web page interactivity)
- [Vite](https://vitest.dev/) for optimized web hosting
- [Tailwind](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for building great looking accessible UI fast

## Credits

- Environmental data provided by various federal, state, local, and tribal air quality agencies through the EPA AirNow program. These federal, state, local, and tribal air quality agencies are the owners of the data and the authorities for the data. A list of state/local/tribal agencies can be found at http://www.airnow.gov/index.cfm?action=airnow.partnerslist.

## The app

The app is a basic multi-user chat. Walkthrough of the source code:

- [convex/auth.ts](./convex/auth.ts) configures the available authentication methods
- [convex/messages.ts](./convex/messages.ts) is the chat backend implementation
- [src/main.tsx](./src/main.tsx) is the frontend entry-point
- [src/App.tsx](./src/App.tsx) determines which UI to show based on the authentication state
- [src/SignInForm.tsx](./src/SignInForm.tsx) implements the sign-in UI
- [src/Chat/Chat.tsx](./src/Chat/Chat.tsx) is the chat frontend

## Configuring other authentication methods

To configure different authentication methods, see [Configuration](https://labs.convex.dev/auth/config) in the Convex Auth docs.

## Learn more

To learn more about developing your project with Convex, check out:

- The [Tour of Convex](https://docs.convex.dev/get-started) for a thorough introduction to Convex principles.
- The rest of [Convex docs](https://docs.convex.dev/) to learn about all Convex features.
- [Stack](https://stack.convex.dev/) for in-depth articles on advanced topics.
