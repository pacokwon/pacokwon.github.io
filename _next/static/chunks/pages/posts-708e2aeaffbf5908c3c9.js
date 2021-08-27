(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[679],{8463:function(a,e,t){"use strict";var n=t(7462),s=t(5987),r=t(7294),i=(t(5697),t(6010)),o=t(9895),c=t(8786),d=r.forwardRef((function(a,e){var t=a.classes,c=a.className,d=a.raised,l=void 0!==d&&d,u=(0,s.Z)(a,["classes","className","raised"]);return r.createElement(o.Z,(0,n.Z)({className:(0,i.Z)(t.root,c),elevation:l?8:1,ref:e},u))}));e.Z=(0,c.Z)({root:{overflow:"hidden"}},{name:"MuiCard"})(d)},9912:function(a,e,t){"use strict";var n=t(7462),s=t(5987),r=t(7294),i=(t(5697),t(6010)),o=t(8786),c=r.forwardRef((function(a,e){var t=a.classes,o=a.className,c=a.component,d=void 0===c?"div":c,l=(0,s.Z)(a,["classes","className","component"]);return r.createElement(d,(0,n.Z)({className:(0,i.Z)(t.root,o),ref:e},l))}));e.Z=(0,o.Z)({root:{padding:16,"&:last-child":{paddingBottom:24}}},{name:"MuiCardContent"})(c)},3832:function(a,e,t){"use strict";var n=t(7462),s=t(5987),r=t(4942),i=t(7294),o=(t(5697),t(6010)),c=t(8786),d=t(3871),l=i.forwardRef((function(a,e){var t=a.classes,r=a.className,c=a.component,l=void 0===c?"div":c,u=a.disableGutters,p=void 0!==u&&u,m=a.fixed,f=void 0!==m&&m,h=a.maxWidth,v=void 0===h?"lg":h,g=(0,s.Z)(a,["classes","className","component","disableGutters","fixed","maxWidth"]);return i.createElement(l,(0,n.Z)({className:(0,o.Z)(t.root,r,f&&t.fixed,p&&t.disableGutters,!1!==v&&t["maxWidth".concat((0,d.Z)(String(v)))]),ref:e},g))}));e.Z=(0,c.Z)((function(a){return{root:(0,r.Z)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",paddingLeft:a.spacing(2),paddingRight:a.spacing(2),display:"block"},a.breakpoints.up("sm"),{paddingLeft:a.spacing(3),paddingRight:a.spacing(3)}),disableGutters:{paddingLeft:0,paddingRight:0},fixed:Object.keys(a.breakpoints.values).reduce((function(e,t){var n=a.breakpoints.values[t];return 0!==n&&(e[a.breakpoints.up(t)]={maxWidth:n}),e}),{}),maxWidthXs:(0,r.Z)({},a.breakpoints.up("xs"),{maxWidth:Math.max(a.breakpoints.values.xs,444)}),maxWidthSm:(0,r.Z)({},a.breakpoints.up("sm"),{maxWidth:a.breakpoints.values.sm}),maxWidthMd:(0,r.Z)({},a.breakpoints.up("md"),{maxWidth:a.breakpoints.values.md}),maxWidthLg:(0,r.Z)({},a.breakpoints.up("lg"),{maxWidth:a.breakpoints.values.lg}),maxWidthXl:(0,r.Z)({},a.breakpoints.up("xl"),{maxWidth:a.breakpoints.values.xl})}}),{name:"MuiContainer"})(l)},4349:function(a,e,t){"use strict";t.r(e),t.d(e,{__N_SSG:function(){return N},default:function(){return y}});var n=t(5893),s=t(7294),r=t(3832),i=t(6010),o=t(1163),c=t(8463),d=t(7462),l=t(5987),u=(t(5697),t(8786)),p=t(2318),m=s.forwardRef((function(a,e){var t=a.action,n=a.avatar,r=a.classes,o=a.className,c=a.component,u=void 0===c?"div":c,m=a.disableTypography,f=void 0!==m&&m,h=a.subheader,v=a.subheaderTypographyProps,g=a.title,x=a.titleTypographyProps,Z=(0,l.Z)(a,["action","avatar","classes","className","component","disableTypography","subheader","subheaderTypographyProps","title","titleTypographyProps"]),b=g;null==b||b.type===p.Z||f||(b=s.createElement(p.Z,(0,d.Z)({variant:n?"body2":"h5",className:r.title,component:"span",display:"block"},x),b));var N=h;return null==N||N.type===p.Z||f||(N=s.createElement(p.Z,(0,d.Z)({variant:n?"body2":"body1",className:r.subheader,color:"textSecondary",component:"span",display:"block"},v),N)),s.createElement(u,(0,d.Z)({className:(0,i.Z)(r.root,o),ref:e},Z),n&&s.createElement("div",{className:r.avatar},n),s.createElement("div",{className:r.content},b,N),t&&s.createElement("div",{className:r.action},t))})),f=(0,u.Z)({root:{display:"flex",alignItems:"center",padding:16},avatar:{flex:"0 0 auto",marginRight:16},action:{flex:"0 0 auto",alignSelf:"flex-start",marginTop:-8,marginRight:-8},content:{flex:"1 1 auto"},title:{},subheader:{}},{name:"MuiCardHeader"})(m),h=t(9912),v=t(1120),g=t(7623),x=(0,v.Z)((function(a){return(0,g.Z)({root:{cursor:"pointer"}})})),Z=function(a){var e=a.post,t=a.className,s=(0,o.useRouter)(),r=x(),d="/posts/".concat(e.id),l=(0,i.Z)(r.root,t);return(0,n.jsxs)(c.Z,{className:l,onClick:function(){return s.push(d)},children:[(0,n.jsx)(f,{title:e.title}),(0,n.jsx)(h.Z,{children:e.date})]})},b=(0,v.Z)((function(a){return(0,g.Z)({cardList:{display:"flex",flexDirection:"column",gap:a.spacing(2)},card:{transition:a.transitions.create("transform",{duration:a.transitions.duration.shorter,easing:a.transitions.easing.easeOut}),"&:hover":{transform:"translateY(-4px)"}}})})),N=!0,y=function(a){var e=a.posts,t=b();return(0,n.jsx)(r.Z,{children:(0,n.jsx)("div",{className:t.cardList,children:e.map((function(a){return(0,n.jsx)(Z,{className:t.card,post:a},a.id)}))})})}},1834:function(a,e,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/posts",function(){return t(4349)}])},1163:function(a,e,t){a.exports=t(4651)}},function(a){a.O(0,[774,888,179],(function(){return e=1834,a(a.s=e);var e}));var e=a.O();_N_E=e}]);