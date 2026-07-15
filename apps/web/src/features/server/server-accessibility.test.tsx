// @vitest-environment jsdom
import{expect,it}from"vitest";import{render}from"@testing-library/react";import axe from"axe-core";import{ServerModePage}from"./ServerModePage";it("hat keine Accessibility-Basisverletzung",async()=>{const{container}=render(<ServerModePage/>);expect((await axe.run(container)).violations).toEqual([])});
