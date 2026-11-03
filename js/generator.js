/* Deterministic constraints, randomized candidates. Each level is a THREE-TERM addition problem.
   Carry means decimal carry in left-to-right sequential addition, NOT the final sum of all addends.
   We record each intermediate sum and count to make the operational definition auditable. */
(function(root){'use strict';
const rand=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=rand(0,i);[x[i],x[j]]=[x[j],x[i]];}return x;};
function carryOnce(a,b){let c=0, carry=0;while(a||b){const s=a%10+b%10+carry;carry=s>=10?1:0;c+=carry;a=Math.floor(a/10);b=Math.floor(b/10);}return c;}
function info(parts){let sum=parts[0],counts=[];for(const p of parts.slice(1)){counts.push(carryOnce(sum,p));sum+=p;}return {sum,carryCounts:counts,totalCarries:counts.reduce((a,b)=>a+b,0)};}
function match(level,parts,meta){const ds=parts.filter(x=>x>=10).length;const positive=parts.filter(x=>x>0).length;const c=meta.totalCarries;
 switch(level){case 0:return parts.filter(x=>x===0).length===2&&positive===1&&meta.sum>=2&&meta.sum<=9;
 case 2:return ds===0&&positive===3&&c===0;
 case 3:return ds===0&&positive===3&&c===1;
 case 5:return ds===0&&positive===3&&c===2;
 case 8:return ds===1&&positive===3&&c===1;
 case 9:return ds===2&&positive===3&&c===2;
 default:return false;}}
function generate(level){if(level===0){const terms=shuffle([rand(2,9),0,0]);return {level,terms,...info(terms)};}
 for(let k=0;k<200000;k++){
  const terms=level===8?shuffle([rand(11,49),rand(2,9),rand(2,9)]):level===9?shuffle([rand(11,49),rand(11,49),rand(2,9)]):[rand(2,9),rand(2,9),rand(2,9)];
  // random term orders for all levels, but maintain the exact sequential-carry definition
  const p=level===8||level===9?terms:shuffle(terms);const meta=info(p);
  if(match(level,p,meta))return {level,terms:p,...meta};
 }throw Error('Could not generate arithmetic at level '+level);
}
const sequences=[[0,2,5,8,9,3],[0,2,5,9,8,3],[0,3,5,8,9,2],[0,3,5,9,8,2]];
function makeBlock(level,count){let dirs=shuffle([1,1,1,1,1,-1,-1,-1,-1,-1]);let distances=shuffle([1,1,1,1,1,2,2,2,2,2]);
 // ensure exact 5 per direction and 5 per distance, while preventing negative comparison thresholds
 return dirs.map((sgn,i)=>{const t=generate(level),offset=sgn*distances[i];if(t.sum+offset<0)throw Error('Invalid comparison threshold');return {...t,comparison:t.sum+offset,offset,comparisonDistance:Math.abs(offset),correctResponse:offset<0?0:1,arithmeticExpression:t.terms.join(' + '),crossesDecade:Math.floor(t.sum/10)!==Math.floor((t.sum+offset)/10)};});
}
root.CometGenerator={generate,makeBlock,info,match,sequences,shuffle};
})(typeof window==='undefined'?globalThis:window);
