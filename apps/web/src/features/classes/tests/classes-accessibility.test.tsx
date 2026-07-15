// @vitest-environment jsdom
import "fake-indexeddb/auto";import{beforeEach,expect,it}from"vitest";import{render,waitFor}from"@testing-library/react";import{MemoryRouter}from"react-router-dom";import axe from"axe-core";import{AppRoutes}from"../../../app/router";import{domainDb}from"../../../domain";
beforeEach(async()=>{await domainDb.delete();await domainDb.open()});
for(const path of["/klassen","/klassen/class-2a/faecher/subject-deutsch"]){it(`hat keine Axe-Basisverstöße: ${path}`,async()=>{const{container}=render(<MemoryRouter initialEntries={[path]}><AppRoutes/></MemoryRouter>);await waitFor(()=>expect(container.querySelector("h1")).toBeTruthy());expect((await axe.run(container)).violations).toEqual([])})}
