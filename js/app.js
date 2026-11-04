(function(root){'use strict';
const G=root.CometGenerator, S=root.CometStorage;
const MAX_ATTEMPTS=3;
const TEXT={
 ja:{title:'計算結果の大小比較',intro:'３つの数を足した結果が、画面の比較数字より「大きい」か「小さい」かを判断してください。<strong>等しい場合はありません。</strong><p>できるだけ正確に回答してください。時間制限はありません。</p><p>画面のボタンをクリックするか、F キー（大きい）、J キー（小さい）で回答できます。</p>',consent:'研究説明と参加確認',consentBody:'この課題では、回答・反応時間・主観評価・ブラウザーと端末に関する基本情報を匿名の識別子とともに記録します。氏名、メールアドレス、正確な位置情報、IPアドレスは実験コードから収集しません。参加は任意で、いつでも画面を閉じて中止できます。送信済みデータの削除や保管期間などは、研究担当者が別途提示する研究説明・同意文書に従います。',accept:'内容を確認し、参加する',decline:'参加しない',leave:'参加は開始されません。この画面を閉じてください。',practice:'回答方法の確認',practiceBody:'まず２問だけ操作方法を練習します。この練習は難易度評価に含まれません。',practiceFeedbackCorrect:'正解です',practiceFeedbackWrong:'不正解です',attemptInfo:'この難易度の第',attemptSuffix:'回目です。10問中9問以上正解すると次へ進みます。最大3回まで挑戦できます。',attemptPass:'基準を満たしました',attemptRetry:'正解が9問未満だったため、同じ難易度をもう一度行います。',attemptStop:'3回の挑戦で正解率の基準に達しませんでした。ここで課題を終了します。',scoreLabel:'正解数',attemptLabel:'挑戦回数',endIncomplete:'正解率の基準に達しなかったため、課題を終了しました。',next:'次へ',greater:'大きい',less:'小さい',relative:'と比べて',question:'計算結果は、次の数より',blockStart:'計算課題',blockInfo:'これから10問に回答してください。その後、評価質問が表示されます。',levelProgress:'ブロック',trialProgress:'問目',q0:['今回の計算課題は、どの程度難しかったですか。','今回の計算課題を行うのに、どの程度の負担を感じましたか。','報酬を得る、または損失を避けるために、今回と同じ難易度の計算課題を行う必要がある場合、この課題をどの程度好ましいと感じますか。'],qOther:['Lv0と比べて、今回の計算課題はどの程度難しく感じましたか。','Lv0と比べて、今回の計算課題を行う際の負担はどの程度増えましたか。','報酬を得る、または損失を避けるために、今回と同じ難易度の計算課題を行う必要がある場合、この課題をどの程度好ましいと感じますか。'],anchors0:[['非常に簡単','どちらともいえない','非常に難しい'],['全く負担を感じなかった','中程度の負担を感じた','非常に大きな負担を感じた'],['非常に嫌い','好きでも嫌いでもない','非常に好き']],anchorsOther:[['ほとんど難しくならなかった','ある程度難しくなった','非常に難しくなった'],['ほとんど負担は増えなかった','ある程度負担が増えた','非常に負担が増えた'],['非常に嫌い','好きでも嫌いでもない','非常に好き']],surveyHeader:'今回の課題を振り返り、以下の質問に回答してください。',send:'回答を送信',finish:'実験終了',finishMessage:'ご参加ありがとうございました。',saved:'オンラインでデータを保存しました。',failed:'オンライン保存を確認できませんでした。下のボタンからバックアップを保存してください。',local:'データはこのブラウザー内にあります。ファイルを保存し、研究担当者に渡してください。',retry:'再送信',json:'JSON を保存',csv:'CSV を保存',downloadHint:'データの保存が終わるまでページを閉じないでください。',mobileWarning:'この研究はパソコンで参加してください。スマートフォン・タブレットは利用できません。'},
 zh:{title:'计算结果大小比较',intro:'请将三个数字相加，判断计算结果比屏幕上的比较数字“大”还是“小”。<strong>不存在相等的情况。</strong><p>请尽量准确作答，没有反应时间限制。</p><p>可点击按钮，或按 F 键（大于）、J 键（小于）回答。</p>',consent:'研究说明与参与确认',consentBody:'本任务使用匿名编号记录作答、反应时间、主观评价以及浏览器和设备的基本信息。实验代码不主动收集姓名、邮箱、精确位置或 IP 地址。参与自愿，可随时关闭页面退出。已经提交的数据如何撤回、保存期限等事项，以研究负责人另行提供的正式知情同意书为准。',accept:'我已阅读并愿意参与',decline:'不参加',leave:'实验未开始，可以关闭页面。',practice:'操作练习',practiceBody:'先完成 2 道操作练习题，练习不计入难度评价。',practiceFeedbackCorrect:'正确',practiceFeedbackWrong:'错误',attemptInfo:'这是该难度的第',attemptSuffix:'轮。每轮 10 题，至少答对 9 题才能继续，最多进行 3 轮。',attemptPass:'已达到正确率要求',attemptRetry:'本轮正确题数不足 9 题，请重新完成同一难度。',attemptStop:'连续 3 轮未达到正确率要求，本次实验将在这里结束。',scoreLabel:'正确题数',attemptLabel:'轮次',endIncomplete:'未达到正确率要求，实验已提前结束。',next:'继续',greater:'大于',less:'小于',relative:'相比',question:'计算结果与下列数字比较',blockStart:'计算任务',blockInfo:'请完成接下来的 10 题，结束后评价这一组任务。',levelProgress:'第',trialProgress:'题',q0:['你觉得刚才的计算任务有多难？','你觉得完成刚才的计算任务有多费力？','假设你需要完成刚才这种难度的计算任务，才能获得报酬或避免损失，你对这种任务的喜欢程度如何？'],qOther:['与 Lv0 相比，你觉得刚才的计算任务难了多少？','与 Lv0 相比，你觉得完成刚才的计算任务费力了多少？','假设你需要完成刚才这种难度的计算任务，才能获得报酬或避免损失，你对这种任务的喜欢程度如何？'],anchors0:[['非常简单','难度适中','非常困难'],['完全不费力','中等程度费力','非常费力'],['非常讨厌','既不讨厌也不喜欢','非常喜欢']],anchorsOther:[['几乎没难多少','难了一定程度','难了非常多'],['几乎没费力多少','费力了一定程度','费力了非常多'],['非常讨厌','既不讨厌也不喜欢','非常喜欢']],surveyHeader:'请回顾刚才这一组任务，并回答下列问题。',send:'提交评价',finish:'实验结束',finishMessage:'感谢参与。',saved:'数据已成功保存至在线数据库。',failed:'无法确认在线保存成功，请保存下方备份文件。',local:'目前数据只在本地浏览器中，请下载文件并交给研究者。',retry:'重新上传',json:'下载 JSON',csv:'下载 CSV',downloadHint:'确认保存完成前，请不要关闭页面。',mobileWarning:'本研究要求使用电脑参加，不接受手机和平板设备。'}
};
function measureDevice(){const n=navigator,s=screen;const ua=n.userAgent||'';return {user_agent:ua,language:n.language,languages:Array.from(n.languages||[]),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,timezone_offset_minutes:new Date().getTimezoneOffset(),platform:n.userAgentData?.platform||n.platform||null,mobile_by_ua_data:n.userAgentData?.mobile??null,touch_points:n.maxTouchPoints||0,has_touch:'ontouchstart' in root,device_memory_gb:n.deviceMemory??null,logical_cores:n.hardwareConcurrency??null,screen_width:s.width,screen_height:s.height,available_width:s.availWidth,available_height:s.availHeight,viewport_width:innerWidth,viewport_height:innerHeight,device_pixel_ratio:devicePixelRatio,orientation:s.orientation?.type??null,referrer_host:(()=>{try{return document.referrer?new URL(document.referrer).hostname:null}catch{return null}})()};}
function mobile(d){return /Android|iPhone|iPad|Mobile/i.test(d.user_agent)||d.mobile_by_ua_data===true;}
function createId(){return root.crypto?.randomUUID?.()||('anon-'+Date.now()+'-'+Math.random().toString(36).slice(2));}
function opts(){return Array.from({length:9},(_,i)=>String(i+1));}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function addScaleLegend(question, anchors){return '<div class="rating-question">'+escapeHtml(question)+'</div><div class="rating-legend"><span><b>1</b> · '+escapeHtml(anchors[0])+'</span><span><b>5</b> · '+escapeHtml(anchors[1])+'</span><span><b>9</b> · '+escapeHtml(anchors[2])+'</span></div>';}
function compactRows(session){return session.records.map(r=>({session_id:session.session_id,language:session.language,sequence_id:session.sequence_id,...r}));}
root.startComet=function(lang){const t=TEXT[lang],c=root.COMET_CONFIG;const sid=createId(),startedAt=new Date().toISOString(),device=measureDevice();const sequenceIndex=Math.floor(Math.random()*G.sequences.length),sequence=G.sequences[sequenceIndex];let keyHandler=null;
const session={session_id:sid,version:c.version+'-accuracy3-scale135',language:lang,sequence_id:sequenceIndex+1,sequence,started_at:startedAt,ended_at:null,complete:false,quality_status:'pending',attention_screening_failed:false,failure_level:null,block_attempts:[],device,config:{trials_per_level:c.trialsPerLevel,practice_trials:c.practiceTrials,show_feedback_during_task:true,max_attempts_per_level:MAX_ATTEMPTS,min_correct_per_attempt:c.trialsPerLevel-1,require_desktop:c.requireDesktop},records:[],summary:null};
const jsPsych=initJsPsych({display_element:undefined,on_finish:async()=>{if(session.consent===false)return;session.ended_at=new Date().toISOString();session.complete=session.quality_status!=='failed_accuracy';if(session.complete)session.quality_status='passed';session.summary=summarize();await showFinal();}});
function base(trial){session.records.push({event:'jspsych',...trial});}
function infoTrial(content,choices=[t.next],extra={}){return {type:jsPsychHtmlButtonResponse,stimulus:content,choices,button_html:'<button class="jspsych-btn">%choice%</button>',...extra};}
const timeline=[];
if(c.requireDesktop&&mobile(device)){timeline.push(infoTrial('<h2>'+t.mobileWarning+'</h2>',[],{}));jsPsych.run(timeline);return;}
timeline.push(infoTrial('<h2>'+t.consent+'</h2><p>'+t.consentBody+'</p>',[t.accept,t.decline],{on_finish:d=>{if(d.response===1){session.consent=false;jsPsych.endExperiment(t.leave);}else session.consent=true;}}));
timeline.push(infoTrial('<h1>'+t.title+'</h1>'+t.intro));
if(c.practiceTrials){timeline.push(infoTrial('<h2>'+t.practice+'</h2><p>'+t.practiceBody+'</p>'));
 for(let i=0;i<c.practiceTrials;i++){
  const q=G.generate(i===0?0:3),offset=i===0?1:-1;
  const stim={...q,comparison:q.sum+offset,offset,correctResponse:offset<0?0:1,arithmeticExpression:q.terms.join(' + '),comparisonDistance:1,crossesDecade:Math.floor(q.sum/10)!==Math.floor((q.sum+offset)/10)};
  timeline.push(makeTrial(stim,-1,i+1,true,()=>0));
  timeline.push(feedbackTrial());
 }}
sequence.forEach((level,blockIndex)=>{
 let attempt=0, passed=false, questions=[], attemptResult=null;
 const trialGroup=[];
 trialGroup.push(infoTrial(()=>'<h2>'+t.blockStart+' '+(blockIndex+1)+'/6 · Lv'+level+'</h2><p>'+t.attemptInfo+(attempt+1)+t.attemptSuffix+'</p>',[t.next],{
  on_start:()=>{attempt++;questions=G.makeBlock(level,c.trialsPerLevel);}
 }));
 for(let i=0;i<c.trialsPerLevel;i++){
  trialGroup.push(makeTrial(()=>questions[i],blockIndex,i+1,false,()=>attempt));
  trialGroup.push(feedbackTrial());
 }
 trialGroup.push(infoTrial(()=>{
  const r=attemptResult;
  return '<h2>'+(r.passed?t.attemptPass:(attempt>=MAX_ATTEMPTS?t.attemptStop:t.attemptRetry))+'</h2>'+
  '<p>'+t.attemptLabel+'：'+attempt+'/'+MAX_ATTEMPTS+'</p>'+
  '<p>'+t.scoreLabel+'：'+r.correct_count+'/'+r.total_count+' ('+Math.round(r.accuracy*100)+'%)</p>';
 },[t.next],{
  on_start:()=>{
   const rows=session.records.filter(r=>r.event==='calculation'&&!r.practice&&r.block_index===blockIndex+1&&r.attempt===attempt);
   const correct=rows.filter(r=>r.correct).length;
   attemptResult={event:'attempt_summary',level,block_index:blockIndex+1,attempt,correct_count:correct,error_count:rows.length-correct,total_count:rows.length,accuracy:rows.length?correct/rows.length:0,passed:rows.length===c.trialsPerLevel&&correct>=c.trialsPerLevel-1,local_timestamp:new Date().toISOString()};
   passed=attemptResult.passed;
   session.block_attempts.push({...attemptResult});
   session.records.push({...attemptResult});
   try{localStorage.setItem('comet_last_session',JSON.stringify(session));}catch{}
  },
  on_finish:()=>{if(!passed&&attempt>=MAX_ATTEMPTS){session.quality_status='failed_accuracy';session.failure_level=level;session.attention_screening_failed=true;session.exclusion_reason='failed_accuracy_threshold_after_3_attempts';jsPsych.endExperiment(t.endIncomplete);}}
 }));
 timeline.push({timeline:trialGroup,loop_function:()=>!passed&&attempt<MAX_ATTEMPTS});
 const baseLevel=level===0,anchors=baseLevel?t.anchors0:t.anchorsOther,qs=baseLevel?t.q0:t.qOther;
 const labels=anchors.map(()=>opts());
 timeline.push({timeline:[{type:jsPsychSurveyLikert,preamble:'<h2>'+t.surveyHeader+'</h2>',questions:qs.map((prompt,i)=>({prompt:addScaleLegend(prompt,anchors[i]),name:['difficulty','effort','liking'][i],labels:labels[i],required:true})),button_label:t.send,randomize_question_order:false,on_finish:d=>{
 const response=d.response||{};const keys=['difficulty','effort','liking'];const vals={};for(const k of keys)vals[k]=Number(response[k])+1;
 session.records.push({event:'rating',level,block_index:blockIndex+1,position:blockIndex+1,passed_attempt:attempt,scale_type:baseLevel?'absolute':'relative_to_level_0',rating_scale_types:{difficulty:baseLevel?'absolute':'relative_to_level_0',effort:baseLevel?'absolute':'relative_to_level_0',liking:'absolute'},difficulty:vals.difficulty,effort:vals.effort,liking:vals.liking,third_rating_construct:'absolute_liking_reward_or_loss_context',questionnaire_rt_ms:d.rt,questionnaire_response_raw:response,local_timestamp:new Date().toISOString(),time_elapsed_ms:d.time_elapsed});
 try{localStorage.setItem('comet_last_session',JSON.stringify(session));}catch{}
 }}],conditional_function:()=>passed});
});
function feedbackTrial(){return {type:jsPsychHtmlKeyboardResponse,stimulus:()=>{
 const r=[...session.records].reverse().find(x=>x.event==='calculation');
 return '<h2>'+(r&&r.correct?t.practiceFeedbackCorrect:t.practiceFeedbackWrong)+'</h2>';
},choices:'NO_KEYS',trial_duration:650};}
async function showFinal(){const result=await S.save(session);const display=document.querySelector('#jspsych-content')||document.body;display.innerHTML='<h2>'+t.finish+'</h2><p>'+(session.complete?t.finishMessage:t.endIncomplete)+'</p><p id="save-status" class="status"></p><div id="save-actions"></div><p class="muted">'+t.downloadHint+'</p>';
const status=document.getElementById('save-status');const actions=document.getElementById('save-actions');status.textContent=result.ok?t.saved:(c.storageMode==='local'?t.local:t.failed+(result.detail?' ('+result.detail+')':''));
const add=(label,fn)=>{const b=document.createElement('button');b.className='jspsych-btn';b.textContent=label;b.onclick=fn;actions.appendChild(b)};
add(t.json,()=>S.exportJson(session));add(t.csv,()=>S.exportCsv(compactRows(session),sid));if(!result.ok&&c.storageMode!=='local')add(t.retry,async()=>{status.textContent='…';const r=await S.save(session);status.textContent=r.ok?t.saved:t.failed+' '+(r.detail||'')});
if(c.downloadBackupOnFinish){try{S.exportJson(session);S.exportCsv(compactRows(session),sid);}catch{}}}
function summarize(){const trials=session.records.filter(x=>x.event==='calculation'&&!x.practice);
 return sequence.map(level=>{const rr=trials.filter(r=>r.level===level);const attempts=session.block_attempts.filter(r=>r.level===level);const successful=attempts.find(r=>r.passed);const selection=successful?rr.filter(r=>r.attempt===successful.attempt):rr;
 return {level,attempts:attempts.length,passed:Boolean(successful),attempt_results:attempts.map(a=>({attempt:a.attempt,correct_count:a.correct_count,error_count:a.error_count,accuracy:a.accuracy,passed:a.passed})),n_total:rr.length,accuracy:selection.length?selection.filter(r=>r.correct).length/selection.length:null,mean_correct_rt_ms:(()=>{const v=selection.filter(r=>r.correct&&Number.isFinite(r.rt_ms)).map(r=>r.rt_ms);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;})()};});}
function makeTrial(qOrGetter,blockIndex,trialNumber,practice,attemptGetter){let q,active=false;
 return {type:jsPsychHtmlButtonResponse,
 on_start:()=>{q=typeof qOrGetter==='function'?qOrGetter():qOrGetter;},
 stimulus:()=>{
  const title='<div class="trial-progress">'+(practice?t.practice:(t.levelProgress+' '+(blockIndex+1)+'/6 · Lv'+q.level+' · '+t.attemptLabel+' '+attemptGetter()+'/'+MAX_ATTEMPTS+' · '+trialNumber+'/'+c.trialsPerLevel))+'</div>';
  return title+'<div class="formula">'+q.arithmeticExpression+'</div><div class="comparison">'+(lang==='ja'?t.question+' <strong>'+q.comparison+'</strong>':t.question+'：<strong>'+q.comparison+'</strong>')+'</div><div class="keyhint">F / J</div>';
 },
 choices:[t.greater,t.less],button_html:['<button class="jspsych-btn choice">F · %choice%</button>','<button class="jspsych-btn choice">J · %choice%</button>'],
 on_load:()=>{active=true;keyHandler=e=>{if(!active||e.repeat||e.altKey||e.ctrlKey||e.metaKey)return;const n=e.key.toLowerCase()==='f'?0:e.key.toLowerCase()==='j'?1:null;if(n!==null){e.preventDefault();const bs=document.querySelectorAll('.jspsych-btn.choice');bs[n]?.click();}};document.addEventListener('keydown',keyHandler);},
 on_finish:d=>{active=false;if(keyHandler){document.removeEventListener('keydown',keyHandler);keyHandler=null;}
 session.records.push({event:'calculation',practice,level:q.level,block_index:practice?null:blockIndex+1,position:practice?null:blockIndex+1,attempt:practice?0:attemptGetter(),trial_in_block:trialNumber,trial_global:practice?null:blockIndex*c.trialsPerLevel+trialNumber,terms:q.terms,arithmetic_expression:q.arithmeticExpression,true_answer:q.sum,intermediate_carry_counts:q.carryCounts,total_carries:q.totalCarries,comparison_number:q.comparison,comparison_offset:q.offset,comparison_distance:q.comparisonDistance,crosses_decade:q.crossesDecade,correct_response:q.correctResponse===0?'greater':'less',response_index:d.response,chosen_response:d.response===0?'greater':d.response===1?'less':null,correct:d.response===q.correctResponse,rt_ms:d.rt,local_timestamp:new Date().toISOString(),time_elapsed_ms:d.time_elapsed,viewport_width:innerWidth,viewport_height:innerHeight,visibility_state:document.visibilityState});
 }};}
// Device / attention events; no raw mouse coordinates, identifying data, or key logs are collected.
let hiddenAt=null;document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenAt=performance.now();session.records.push({event:'page_hidden',local_timestamp:new Date().toISOString()});}else if(hiddenAt!==null){session.records.push({event:'page_visible',hidden_duration_ms:Math.round(performance.now()-hiddenAt),local_timestamp:new Date().toISOString()});hiddenAt=null;}});
root.addEventListener('resize',()=>{session.device.last_viewport_width=innerWidth;session.device.last_viewport_height=innerHeight;session.device.resize_count=(session.device.resize_count||0)+1;});
jsPsych.run(timeline);
};
})(window);
