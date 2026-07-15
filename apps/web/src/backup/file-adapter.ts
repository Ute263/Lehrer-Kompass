import { BackupError } from "./contracts";
export async function saveTextFile(text:string,fileName:string,mime="application/vnd.lehrerkompass.backup+json"){
  const picker=(window as unknown as {showSaveFilePicker?: (options:unknown)=>Promise<{createWritable():Promise<{write(v:string):Promise<void>;close():Promise<void>}>}>}).showSaveFilePicker;
  if(picker){try{const handle=await picker({suggestedName:fileName,types:[{description:"LehrerKompass-Sicherung",accept:{[mime]:[".json"]}}]});const writable=await handle.createWritable();await writable.write(text);await writable.close();return "picker" as const;}catch(error){if(error instanceof DOMException&&error.name==="AbortError")throw new BackupError("FILE_SAVE_CANCELLED","Speichern wurde abgebrochen.");throw new BackupError("FILE_ACCESS_DENIED","Die Datei konnte nicht gespeichert werden.");}}
  const url=URL.createObjectURL(new Blob([text],{type:mime}));const link=document.createElement("a");link.href=url;link.download=fileName;link.click();URL.revokeObjectURL(url);return "download" as const;
}
