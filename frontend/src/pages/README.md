# Frontend page modules

The React frontend renders server-selected pages. The application in `../main2.jsx`
requests the current route as JSON, reads its `view` value, and uses
`PageRegistry.jsx` to select the corresponding page component. Registry keys are
the view identifiers returned by the Express routes (for example,
`routes/home.ejs`); they are identifiers, not files that React renders directly.

## Organization

- `customer/` contains storefront, cart, order, profile, address, and delivery
  application pages.
- `admin/` contains administration pages for products, inventory, customers,
  orders, and delivery partner requests.
- `delivery/` contains delivery partner dashboards, assigned orders, delivery
  status pages, and profile pages.
- The directory root contains shared account pages, checkout and empty states,
  address-related UI, and other page-level components.
- `PageRegistry.jsx` maps server view identifiers to the page modules.
- `ui.jsx` provides shared display helpers and components, including
  `Intro`, `Empty`, `Field`, `Status`, and `OrderTable`.

The registry is the source of truth for which page modules are selected from a
server response. A component that is not registered is not selected by its view
identifier.

## Page component data

Page components rendered by the standard page renderer receive `data`, `view`,
`path`, `user`, and the `submit` handler; it also passes category selection
state and its update callback. The login, signup, and password-reset pages are
rendered by a separate branch and receive `submit` and `notice`. Use the props a
component needs, and avoid duplicating navigation or form-submission behavior
already provided by `../main2.jsx`.

## Adding or updating a registered page

1. Put the module in the role-specific directory when it belongs to customer,
   admin, or delivery workflows; use the directory root for shared page modules.
2. Export the page component as the module's default export.
3. Import it in `PageRegistry.jsx` and map the exact server `view` identifier to
   the component.
4. Confirm the corresponding server route returns that identifier and the data
   shape expected by the component.
5. From the project root, run `npm run build` to verify the frontend bundle.

`npm test` is currently a placeholder in the root package configuration and
does not run a frontend test suite.
