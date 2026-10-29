// Plain scientific notation is a display preference; source records and editable text stay intact.
const scripts=/[\u2070-\u209f\u00b2\u00b3\u00b9ᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁⱽᵂ]/gu;
export const plainScientificText=value=>String(value??'').replace(scripts,char=>char.normalize('NFKC').replace(/−/g,'-'));

export function plainDisplay(root){
  if(!root||!root.ownerDocument?.createTreeWalker)return;
  const visit=node=>{
    if(node.nodeType===3){
      if(node.parentElement?.closest('script,style,textarea,[contenteditable]'))return;
      const next=plainScientificText(node.data);if(next!==node.data)node.data=next;
    }else if(node.nodeType===1){
      for(const attr of ['placeholder','title','aria-label','alt']){
        const value=node.getAttribute(attr);if(value===null)continue;
        const next=plainScientificText(value);if(next!==value)node.setAttribute(attr,next);
      }
    }
  };
  visit(root);
  const walker=root.ownerDocument.createTreeWalker(root,5);let node;
  while((node=walker.nextNode()))visit(node);
}
export function installPlainDisplay(root=globalThis.document?.documentElement){
  plainDisplay(root);
  if(!root||typeof MutationObserver==='undefined')return;
  const observer=new MutationObserver(records=>{
    for(const record of records){
      if(record.type==='childList')for(const node of record.addedNodes)plainDisplay(node);
      else plainDisplay(record.target);
    }
  });
  observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','alt']});
  return observer;
}
