- [x] Refactor file structure
- [ ] Refactor mouse controls into its own file so i can access mouse dependant features in the future
- [ ] Refactor scroll into mouse file or it own <== NEXT
- [x] Fix sprite generator <== Not Patterned the way i like it. Look into the coords in the FLOAT32Array(i was a dumby and only looked to see if it length was correct.)
- [ ] Make shake cup <== Could be a quick easy evening spin up
- [ ] Update links
- [ ] stylize modal
- [ ] comment code
- [x] Push to Production
  - [ ] Continual updates
- [ ] Add footer

- Mar 1
  Fixed file path issues. Even though the public folder is....well public, vercel on its build or vite or something ignores the public pathing and makes it at the root so my models were not loading in production but they were locally
  Added simpler hover effect for section links
- Feb 25
  Added sprinkle.png
  Fixed sprite positionArray values. They were indexed wrong during creation
  ( When i was debugging i looked to see how long the array was instead of actually looking and inspecting the actual value )
  Sprinkle Animation added
  Added SectionLights. Meshes on the bottom where too shaded
  PUSH TO MAIN
