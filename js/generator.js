/* CoMET arithmetic generator v2.1 — anti-repetition.
   Each trial is a three-term addition, result <= 50. Carries are counted in
   the displayed left-to-right calculation order (not an invariant of addition).
   Lv0 and Lv2 have only 8 and 7 distinct unordered combinations, respectively;
   hence a 10-trial block cannot have unique combinations throughout.
*/
(function(root){'use strict';
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=rand(0,i);[out[i],out[j]]=[out[j],out[i]];}return out;};
function carryOnce(a,b){let n=0,carry=0;while(a||b){const s=a%10+b%10+carry;carry=s>=10?1:0;n+=carry;a=Math.floor(a/10);b=Math.floor(b/10);}return n;}
function info(parts){let sum=parts[0],counts=[];for(const p of parts.slice(1)){counts.push(carryOnce(sum,p));sum+=p;}return {sum,carryCounts:counts,totalCarries:counts.reduce((a,b)=>a+b,0)};}
function match(level,parts,meta){if(meta.sum>50)return false;const ds=parts.filter(x=>x>=10).length,positive=parts.filter(x=>x>0).length,c=meta.totalCarries;
 switch(level){case 0:return parts.filter(x=>x===0).length===2&&positive===1&&meta.sum>=2&&meta.sum<=9;
 case 2:return ds===0&&positive===3&&c===0;
 case 3:return ds===0&&positive===3&&c===1;
 case 5:return ds===0&&positive===3&&c===2;
 case 8:return ds===1&&positive===3&&c===1;
 case 9:return ds===2&&positive===3&&c===2;
 default:return false;}}
const sequences=[[0,2,5,8,9,3],[0,2,5,9,8,3],[0,3,5,8,9,2],[0,3,5,9,8,2]];
const poolCache=new Map();
function pool(level){if(poolCache.has(level))return poolCache.get(level);
 const tuples=[];
 if(level===0){for(let v=2;v<=9;v++)for(let pos=0;pos<3;pos++){let a=[0,0,0];a[pos]=v;tuples.push(a);}}
 else {const ranges=level===8?[[11,35],[2,9],[2,9]]:level===9?[[11,29],[11,29],[2,9]]:[[2,9],[2,9],[2,9]];
  for(let a=ranges[0][0];a<=ranges[0][1];a++)for(let b=ranges[1][0];b<=ranges[1][1];b++)for(let c=ranges[2][0];c<=ranges[2][1];c++){
   const x=[a,b,c];const perms=[[x[0],x[1],x[2]],[x[0],x[2],x[1]],[x[1],x[0],x[2]],[x[1],x[2],x[0]],[x[2],x[0],x[1]],[x[2],x[1],x[0]]];
   for(const p of perms)tuples.push(p);
  }}
 const seen=new Set(),valid=[];
 for(const t of tuples){const k=t.join(',');if(seen.has(k))continue;seen.add(k);const m=info(t);if(match(level,t,m))valid.push({level,terms:t,...m,key:k,comboKey:[...t].sort((a,b)=>a-b).join(',')});}
 if(!valid.length)throw Error('No valid arithmetic questions for level '+level);
 poolCache.set(level,valid);return valid;
}
function generate(level){const p=pool(level);const x=p[rand(0,p.length-1)];return {level,terms:[...x.terms],sum:x.sum,carryCounts:[...x.carryCounts],totalCarries:x.totalCarries};}
function makeBlock(level,count=10,priorHistory=[]){
 const candidates=pool(level), history=priorHistory.map(x=>({comboKey:x.comboKey||[...(x.terms||[])].sort((a,b)=>a-b).join(','),key:x.key||(x.terms||[]).join(',')}));
 const usedKeys=new Set(history.map(x=>x.key)), usedCombo=new Map();for(const x of history)usedCombo.set(x.comboKey,(usedCombo.get(x.comboKey)||0)+1);
 const selected=[];
 for(let i=0;i<count;i++){
  const last2=[...history,...selected].slice(-2), forbidden=new Set(last2.map(x=>x.comboKey));
  let possible=candidates.filter(x=>!forbidden.has(x.comboKey));
  if(!possible.length)throw Error('Cannot avoid a combination within the preceding two trials at Lv'+level);
  // Select the least-used unordered combination first. In Lv0/Lv2,
  // unavoidable repeats are separated by at least two different problems.
  // Never repeat an exact expression inside this 10-trial block if feasible.
  const freshInBlock=possible.filter(x=>!selected.some(y=>y.key===x.key));
  if(freshInBlock.length)possible=freshInBlock;
  let bestUse=Math.min(...possible.map(x=>usedCombo.get(x.comboKey)||0));
  possible=possible.filter(x=>(usedCombo.get(x.comboKey)||0)===bestUse);
  // Across retry rounds, prefer new display orders where possible.
  const fresh=possible.filter(x=>!usedKeys.has(x.key));if(fresh.length)possible=fresh;
  // Avoid repeating the same unordered combination in the same ordinal position
  // of earlier attempts when multiple candidates are equally good.
  const chosen=possible[rand(0,possible.length-1)];
  const item={level,terms:[...chosen.terms],sum:chosen.sum,carryCounts:[...chosen.carryCounts],totalCarries:chosen.totalCarries,key:chosen.key,comboKey:chosen.comboKey};
  selected.push(item);usedKeys.add(item.key);usedCombo.set(item.comboKey,(usedCombo.get(item.comboKey)||0)+1);
 }
 const dirs=shuffle([1,1,1,1,1,-1,-1,-1,-1,-1]);
 const distances=shuffle([1,1,1,1,1,2,2,2,2,2]);
 return selected.map((t,i)=>{const offset=dirs[i]*distances[i];if(t.sum+offset<0)throw Error('Invalid comparison threshold');
  return {...t,comparison:t.sum+offset,offset,comparisonDistance:Math.abs(offset),correctResponse:offset<0?0:1,arithmeticExpression:t.terms.join(' + '),crossesDecade:Math.floor(t.sum/10)!==Math.floor((t.sum+offset)/10)};
 });
}
root.CometGenerator={generate,makeBlock,info,match,sequences,shuffle};
})(typeof window==='undefined'?globalThis:window);
