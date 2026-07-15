import {useCallback,useEffect,useState} from "react"; import {domainService} from "../../domain";
export type DomainSnapshot=Awaited<ReturnType<typeof domainService.snapshot>>;
export function useDomainData(){const[data,setData]=useState<DomainSnapshot>();const[error,setError]=useState("");const load=useCallback(()=>domainService.snapshot().then(setData).catch(()=>setError("Die lokalen Fachdaten konnten nicht sicher geladen werden.")),[]);useEffect(()=>{void load()},[load]);return{data,error,refresh:load};}
