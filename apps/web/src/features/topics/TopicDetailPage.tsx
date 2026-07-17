import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { addMaterial, addTask, readTopics, updateTopic, type TopicRecord } from "./topicStore";
import "./topic-center.css";

export function TopicDetailPage() {
 const { topicId }=useParams();
 const [topic,setTopic]=useState<TopicRecord|null>(()=>readTopics().find(t=>t.id===topicId)||null);
 const [title,setTitle]=useState(""); const [lessonId,setLessonId]=useState(""); const [task,setTask]=useState("");
 if(!topic)return <div className="topic-center"><Link to="/themen"><ArrowLeft/>Alle Themen</Link><p>Thema nicht gefunden.</p></div>;
 const save=(next:TopicRecord)=>{setTopic(next);updateTopic(next)};
 return <div className="topic-center">
  <header className="topic-detail-header"><Link to="/themen"><ArrowLeft/>Alle Themen</Link><div><p>{topic.subject} · Klasse {topic.classLevel}</p><h1>{topic.title}</h1><span>{topic.description||"Alles zu diesem Thema an einem Ort."}</span></div></header>
  <section className="topic-summary"><div><strong>{topic.lessons.length}</strong><span>Stunden</span></div><div><strong>{topic.materials.length}</strong><span>Materialien</span></div><div><strong>{topic.tasks.filter(t=>!t.done).length}</strong><span>offen</span></div></section>
  <section className="topic-section"><div className="topic-section__heading"><div><p>Planung</p><h2>Unterrichtsstunden</h2></div></div><div className="lesson-list">{topic.lessons.map((lesson,index)=><article className="lesson-row" key={lesson.id}><span>{index+1}</span><div><input value={lesson.title} onChange={e=>save({...topic,lessons:topic.lessons.map((l,i)=>i===index?{...l,title:e.target.value}:l)})}/><textarea rows={2} value={lesson.focus} placeholder="Ziel oder Ablauf" onChange={e=>save({...topic,lessons:topic.lessons.map((l,i)=>i===index?{...l,focus:e.target.value}:l)})}/><small>{lesson.materialIds.length} Materialien</small></div></article>)}</div></section>
  <section className="topic-section"><div className="topic-section__heading"><div><p>Materialien</p><h2>Erstellen und zuordnen</h2></div></div><div className="material-add"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Materialtitel"/><select value={lessonId} onChange={e=>setLessonId(e.target.value)}><option value="">Ganzes Thema</option>{topic.lessons.map((l,i)=><option key={l.id} value={l.id}>Stunde {i+1}</option>)}</select><button className="topic-primary" onClick={()=>{if(title.trim()){setTopic(addMaterial(topic,title,"Arbeitsblatt",lessonId));setTitle("")}}}><Plus/>Material hinzufügen</button></div><div className="material-list">{topic.materials.map(m=><article key={m.id}><div><span>{m.kind}</span><h3>{m.title}</h3></div><small>{m.status}</small></article>)}</div></section>
  <section className="topic-section"><div className="topic-section__heading"><div><p>Vorbereitung</p><h2>Offene Aufgaben</h2></div></div><div className="task-add"><input value={task} onChange={e=>setTask(e.target.value)} placeholder="z. B. Material drucken"/><button className="topic-secondary" onClick={()=>{if(task.trim()){setTopic(addTask(topic,task));setTask("")}}}><Plus/>Hinzufügen</button></div><div className="task-list">{topic.tasks.map(item=><label key={item.id}><input type="checkbox" checked={item.done} onChange={()=>save({...topic,tasks:topic.tasks.map(t=>t.id===item.id?{...t,done:!t.done}:t)})}/><span>{item.text}</span></label>)}</div></section>
 </div>;
}
