!function(){"use strict";var t=tinymce.util.Tools.resolve("tinymce.PluginManager");const e=(n=null,t=>n===t);var n;const o=t=>t,r={aletter:"[A-Za-zªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-׳ؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆༀཀ-ཇཉ-ཬྈ-ྌႠ-Ⴥა-ჺჼᄀ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᨀ-ᨖᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᯀ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⒶ-ⓩⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⴀ-ⴥⴰ-ⵥⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〻〼ㄅ-ㄭㄱ-ㆎㆠ-ㆺꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐꞑꞠ-ꞩꟺ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚﾠ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]",midnumlet:"[-'\\.‘’․﹒＇．]",midletter:"[:··״‧︓﹕：]",midnum:"[±+*/,;;։،؍٬߸⁄︐︔﹐﹔，；]",numeric:"[0-9٠-٩٫۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯๐-๙໐-໙༠-༩၀-၉႐-႙០-៩᠐-᠙᥆-᥏᧐-᧙᪀-᪉᪐-᪙᭐-᭙᮰-᮹᱀-᱉᱐-᱙꘠-꘩꣐-꣙꤀-꤉꧐-꧙꩐-꩙꯰-꯹]",cr:"\\r",lf:"\\n",newline:"[\v\f\u2028\u2029]",extend:"[̀-ͯ҃-҉֑-ׇֽֿׁׂׅׄؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۤۧۨ-ܑۭܰ-݊ަ-ް߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ऀ-ःऺ-़ा-ॏ॑-ॗॢॣঁ-ঃ়া-ৄেৈো-্ৗৢৣਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑੰੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣஂா-ூெ-ைொ-்ௗఁ-ఃా-ౄె-ైొ-్ౕౖౢౣಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣംഃാ-ൄെ-ൈൊ-്ൗൢൣංඃ්ා-ුූෘ-ෟෲෳัิ-ฺ็-๎ັິ-ູົຼ່-ໍ༹༘༙༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏႚ-ႝ፝-፟ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳា-៓៝᠋-᠍ᢩᤠ-ᤫᤰ-᤻ᦰ-ᧀᧈᧉᨗ-ᨛᩕ-ᩞ᩠-᩿᩼ᬀ-ᬄ᬴-᭄᭫-᭳ᮀ-ᮂᮡ-᯦᮪-᯳ᰤ-᰷᳐-᳔᳒-᳨᳭ᳲ᷀-ᷦ᷼-᷿‌‍⃐-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꙯-꙲꙼꙽꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣠-꣱ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀ꨩ-ꨶꩃꩌꩍꩻꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꯣ-ꯪ꯬꯭ﬞ︀-️︠-︦ﾞﾟ]",format:"[­؀-؃۝܏឴឵‎‏‪-‮⁠-⁤⁪-⁯\ufeff￹-￻]",katakana:"[〱-〵゛゜゠-ヺー-ヿㇰ-ㇿ㋐-㋾㌀-㍗ｦ-ﾝ]",extendnumlet:"[=_‿⁀⁔︳︴﹍-﹏＿∀-⋿<>]",punctuation:"[!-#%-*,-\\/:;?@\\[-\\]_{}¡«·»¿;·՚-՟։֊־׀׃׆׳״؉؊،؍؛؞؟٪-٭۔܀-܍߷-߹࠰-࠾࡞।॥॰෴๏๚๛༄-༒༺-༽྅࿐-࿔࿙࿚၊-၏჻፡-፨᐀᙭᙮᚛᚜᛫-᛭᜵᜶។-៖៘-៚᠀-᠊᥄᥅᨞᨟᪠-᪦᪨-᪭᭚-᭠᯼-᯿᰻-᰿᱾᱿᳓‐-‧‰-⁃⁅-⁑⁓-⁞⁽⁾₍₎〈〉❨-❵⟅⟆⟦-⟯⦃-⦘⧘-⧛⧼⧽⳹-⳼⳾⳿⵰⸀-⸮⸰⸱、-〃〈-】〔-〟〰〽゠・꓾꓿꘍-꘏꙳꙾꛲-꛷꡴-꡷꣎꣏꣸-꣺꤮꤯꥟꧁-꧍꧞꧟꩜-꩟꫞꫟꯫﴾﴿︐-︙︰-﹒﹔-﹡﹣﹨﹪﹫！-＃％-＊，-／：；？＠［-］＿｛｝｟-･]"},c=0,u=1,a=2,l=3,s=4,i=5,d=6,g=7,p=8,h=9,m=10,C=11,y=12,f=13,w=[new RegExp(r.aletter),new RegExp(r.midnumlet),new RegExp(r.midletter),new RegExp(r.midnum),new RegExp(r.numeric),new RegExp(r.cr),new RegExp(r.lf),new RegExp(r.newline),new RegExp(r.extend),new RegExp(r.format),new RegExp(r.katakana),new RegExp(r.extendnumlet),new RegExp("@")],x=new RegExp("^"+r.punctuation+"$"),W=w,E=f,R=t=>{let e=E;const n=W.length;for(let o=0;o<n;++o){const n=W[o];if(n&&n.test(t)){e=o;break}}return e},S=t=>((t,e)=>{const n=t.length,o=new Array(n);for(let r=0;r<n;r++){const n=t[r];o[r]=e(n,r)}return o})(t,(t=>{const e={};return n=>{if(e[n])return e[n];{const o=t(n);return e[n]=o,o}}})(R)),b=(t,e)=>{const n=t[e],o=t[e+1];if(e<0||e>t.length-1&&0!==e)return!1;if(n===c&&o===c)return!1;const r=t[e+2];if(n===c&&(o===a||o===u||o===y)&&r===c)return!1;const f=t[e-1];return(n!==a&&n!==u&&o!==y||o!==c||f!==c)&&((n!==s&&n!==c||o!==s&&o!==c)&&((n!==l&&n!==u||o!==s||f!==s)&&((n!==s||o!==l&&o!==u||r!==s)&&(n!==p&&n!==h&&f!==p&&f!==h&&o!==p&&o!==h&&((n!==i||o!==d)&&(n===g||n===i||n===d||(o===g||o===i||o===d||(n!==m||o!==m)&&((o!==C||n!==c&&n!==s&&n!==m&&n!==C)&&((n!==C||o!==c&&o!==s&&o!==m)&&n!==y)))))))))},v=/^\s+$/,k=x,F=t=>"http"===t||"https"===t,T=(t,e)=>{const n=((t,e)=>{let n;for(n=e;n<t.length&&!v.test(t[n]);n++);return n})(t,e+1);return"://"===t.slice(e+1,n).join("").substr(0,3)?n:e},A=(t,e,n)=>{n={includeWhitespace:!1,includePunctuation:!1,...n};const o=[],r=[];for(let n=0;n<t.length;n++){const c=e(t[n]);"\ufeff"!==c&&(o.push(t[n]),r.push(c))}return((t,e,n,o)=>{const r=[];let c=[];for(let u=0;u<n.length;++u)if(c.push(t[u]),b(n,u)){const n=e[u];if((o.includeWhitespace||!v.test(n))&&(o.includePunctuation||!k.test(n))){const n=u-c.length+1,o=u+1,a=e.slice(n,o).join("");if(F(a)){const n=T(e,u),r=t.slice(o,n);Array.prototype.push.apply(c,r),u=n}r.push(c)}c=[]}return r})(o,r,S(r),n)};var B=tinymce.util.Tools.resolve("tinymce.dom.TreeWalker");const D=(t,e)=>{const n=e.getBlockElements(),o=e.getVoidElements(),r=t=>n[t.nodeName]||o[t.nodeName],c=[];let u="";const a=new B(t,t);let l;for(;l=a.next();)3===l.nodeType?u+=l.data.replace(/\uFEFF/g,""):r(l)&&u.length&&(c.push(u),u="");return u.length&&c.push(u),c},j=t=>t.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"_").length,U=(t,e)=>{const n=(t=>t.replace(/\u200B/g,""))(D(t,e).join("\n"));return A(n.split(""),o).length},M=(t,e)=>{const n=D(t,e).join("");return j(n)},P=(t,e)=>{const n=D(t,e).join("").replace(/\s/g,"");return j(n)},_=(t,e)=>()=>e(t.getBody(),t.schema),N=(t,e)=>()=>e(t.selection.getRng().cloneContents(),t.schema),V=t=>_(t,U),$=(t,e)=>{t.addCommand("mceWordCount",(()=>((t,e)=>{t.windowManager.open({title:"Word Count",body:{type:"panel",items:[{type:"table",header:["Count","Document","Selection"],cells:[["Words",String(e.body.getWordCount()),String(e.selection.getWordCount())],["Characters (no spaces)",String(e.body.getCharacterCountWithoutSpaces()),String(e.selection.getCharacterCountWithoutSpaces())],["Characters",String(e.body.getCharacterCount()),String(e.selection.getCharacterCount())]]}]},buttons:[{type:"cancel",name:"close",text:"Close",primary:!0}]})})(t,e)))};var z=tinymce.util.Tools.resolve("tinymce.util.Delay");const I=(t,e)=>{((t,e)=>{t.dispatch("wordCountUpdate",{wordCount:{words:e.body.getWordCount(),characters:e.body.getCharacterCount(),charactersWithoutSpaces:e.body.getCharacterCountWithoutSpaces()}})})(t,e)},Z=(t,n,o)=>{const r=((t,n)=>{let o=null;return{cancel:()=>{e(o)||(clearTimeout(o),o=null)},throttle:(...r)=>{e(o)&&(o=setTimeout((()=>{o=null,t.apply(null,r)}),n))}}})((()=>I(t,n)),o);t.on("init",(()=>{I(t,n),z.setEditorTimeout(t,(()=>{t.on("SetContent BeforeAddUndo Undo Redo ViewUpdate keyup",r.throttle)}),0),t.on("remove",r.cancel)}))};((e=300)=>{t.add("wordcount",(t=>{const n=(t=>({body:{getWordCount:V(t),getCharacterCount:_(t,M),getCharacterCountWithoutSpaces:_(t,P)},selection:{getWordCount:N(t,U),getCharacterCount:N(t,M),getCharacterCountWithoutSpaces:N(t,P)},getCount:V(t)}))(t);return $(t,n),(t=>{const e=()=>t.execCommand("mceWordCount");t.ui.registry.addButton("wordcount",{tooltip:"Word count",icon:"character-count",onAction:e}),t.ui.registry.addMenuItem("wordcount",{text:"Word count",icon:"character-count",onAction:e})})(t),Z(t,n,e),n}))})()}();