## Running locally

For maps to work properly you must profide a `MapKitJS_AuthKey.p8` file in the server directory. This is private for each developer an is in the `.gitignore` file so it will
never be added to the repo. You will also have to update the `runLocal.sh` with your KID and ISS see [here](https://developer.apple.com/documentation/mapkitjs/creating_and_using_tokens_with_mapkit_js) for more information about MapKitJS.

   cd server
   ./runLocal

## To Do List for MVP

- [ ] (Attr) Map, supporting a single pin. or polygon
- [ ] (Attr) Image, single and multi. Single should be full width, multi should be small, maybe 40px width.
- [ ] (Cont) Map, supporting multiple pins, lines or polygons, geojson data
- [ ] (Cont) Image, Single image, jumotron, or grid
- [ ] (Cont) Image Overlay, hitbox/button at (x,y) on image to open an info callout
- [ ] (Cont) SheetMusic, add download button to get a svg or pdf
- [ ] (Auth) Finish forgot password
- [ ] (Auth) Secure backend routes, only GET without authorization header
- [ ] (Code) Add an audit log for document creating and editing
- [ ] (Code) Create and hookup document history view
- [ ] (Code) Add a v-alert or v-banner when saving or loading data fails
- [ ] (Code) Fix issues with template editor (vuex store updates not updating view)
- [ ] (Code) Support printing a document without buttons/header/footer/UI/etc.
- [ ] (Code) Fix the upload media dialog to support drag and drop, preview and progress bar
- [ ] (Code) Fix all TypeScript issues
- [ ] (Code) Add unit tests for all components
  - [ ] App.vue
  - [ ] views/Docuemnt.vue
  - [ ] views/Home.vue
  - [ ] views/Search.vue
  - [ ] views/Tempalte.vue
  - [ ] components/ABC.vue
  - [ ] components/Footer.vue
  - [ ] components/Header.vue
  - [ ] components/Mermaid.vue
  - [ ] components/Attributes/Attribute.vue
  - [ ] components/Attributes/AttributeArmedForces.vue
  - [ ] components/Attributes/AttributeCountry.vue
  - [ ] components/Attributes/AttributeDate.vue
  - [ ] components/Attributes/AttributeDuration.vue
  - [ ] components/Attributes/AttributeName.vue
  - [ ] components/Attributes/AttributeNumber.vue
  - [ ] components/Attributes/AttributeOptions.vue
  - [ ] components/Attributes/AttributeString.vue
  - [ ] components/Content/Content.vue
  - [ ] components/Content/ContentDatatable.vue
  - [ ] components/Content/ContentGraph.vue
  - [ ] components/Content/ContentSheetMusic.vue
  - [ ] components/Content/ContentText.vue
  - [ ] components/Dialogs/DialogAuth.vue
  - [ ] components/Dialogs/DialogDirty.vue
  - [ ] components/Dialogs/DialogNewAttribute.vue
  - [ ] components/Dialogs/DialogNewDocument.vue
  - [ ] components/Dialogs/DialogNewSection.vue
  - [ ] components/Dialogs/DialogNewTemplate.vue
  - [ ] components/Dialogs/DialogSystemInfo.vue
  - [ ] components/Dialogs/DialogUploadMedia.vue