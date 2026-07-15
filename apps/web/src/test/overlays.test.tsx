// @vitest-environment jsdom
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button, Dialog, Drawer } from "../design-system/components";

function DialogHarness() { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>Dialog öffnen</Button><Dialog open={open} title="Testdialog" onClose={() => setOpen(false)}><p>Dialoginhalt</p></Dialog></>; }
function DrawerHarness() { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>Drawer öffnen</Button><Drawer open={open} title="Testbereich" onClose={() => setOpen(false)}><Button>Im Drawer</Button></Drawer></>; }

describe("Overlays", () => {
  it("öffnet, fokussiert, schließt per Escape und gibt Fokus zurück", async () => {
    const user = userEvent.setup(); render(<DialogHarness />); const opener = screen.getByRole("button", { name: "Dialog öffnen" }); await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Testdialog" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dialog schließen" })).toHaveFocus();
    await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); expect(opener).toHaveFocus();
  });

  it("hält den Fokus im Dialog", async () => {
    const user = userEvent.setup(); render(<DialogHarness />); await user.click(screen.getByRole("button", { name: "Dialog öffnen" }));
    const close = screen.getByRole("button", { name: "Dialog schließen" }); close.focus(); await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(screen.getByRole("button", { name: "Übernehmen" })).toHaveFocus();
  });

  it("öffnet und schließt den Drawer mit Fokusführung", async () => {
    const user = userEvent.setup(); render(<DrawerHarness />); const opener = screen.getByRole("button", { name: "Drawer öffnen" }); await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Testbereich" })).toBeInTheDocument(); expect(screen.getByRole("button", { name: "Seitenbereich schließen" })).toHaveFocus();
    await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); expect(opener).toHaveFocus();
  });
});
