(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[679],{8463:function(e,a,t){"use strict";var n=t(7462),s=t(5987),r=t(7294),i=(t(5697),t(6010)),o=t(9895),c=t(8786),d=r.forwardRef((function(e,a){var t=e.classes,c=e.className,d=e.raised,l=void 0!==d&&d,u=(0,s.Z)(e,["classes","className","raised"]);return r.createElement(o.Z,(0,n.Z)({className:(0,i.Z)(t.root,c),elevation:l?8:1,ref:a},u))}));a.Z=(0,c.Z)({root:{overflow:"hidden"}},{name:"MuiCard"})(d)},9912:function(e,a,t){"use strict";var n=t(7462),s=t(5987),r=t(7294),i=(t(5697),t(6010)),o=t(8786),c=r.forwardRef((function(e,a){var t=e.classes,o=e.className,c=e.component,d=void 0===c?"div":c,l=(0,s.Z)(e,["classes","className","component"]);return r.createElement(d,(0,n.Z)({className:(0,i.Z)(t.root,o),ref:a},l))}));a.Z=(0,o.Z)({root:{padding:16,"&:last-child":{paddingBottom:24}}},{name:"MuiCardContent"})(c)},3832:function(e,a,t){"use strict";var n=t(7462),s=t(5987),r=t(4942),i=t(7294),o=(t(5697),t(6010)),c=t(8786),d=t(3871),l=i.forwardRef((function(e,a){var t=e.classes,r=e.className,c=e.component,l=void 0===c?"div":c,u=e.disableGutters,p=void 0!==u&&u,m=e.fixed,f=void 0!==m&&m,h=e.maxWidth,v=void 0===h?"lg":h,g=(0,s.Z)(e,["classes","className","component","disableGutters","fixed","maxWidth"]);return i.createElement(l,(0,n.Z)({className:(0,o.Z)(t.root,r,f&&t.fixed,p&&t.disableGutters,!1!==v&&t["maxWidth".concat((0,d.Z)(String(v)))]),ref:a},g))}));a.Z=(0,c.Z)((function(e){return{root:(0,r.Z)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",paddingLeft:e.spacing(2),paddingRight:e.spacing(2),display:"block"},e.breakpoints.up("sm"),{paddingLeft:e.spacing(3),paddingRight:e.spacing(3)}),disableGutters:{paddingLeft:0,paddingRight:0},fixed:Object.keys(e.breakpoints.values).reduce((function(a,t){var n=e.breakpoints.values[t];return 0!==n&&(a[e.breakpoints.up(t)]={maxWidth:n}),a}),{}),maxWidthXs:(0,r.Z)({},e.breakpoints.up("xs"),{maxWidth:Math.max(e.breakpoints.values.xs,444)}),maxWidthSm:(0,r.Z)({},e.breakpoints.up("sm"),{maxWidth:e.breakpoints.values.sm}),maxWidthMd:(0,r.Z)({},e.breakpoints.up("md"),{maxWidth:e.breakpoints.values.md}),maxWidthLg:(0,r.Z)({},e.breakpoints.up("lg"),{maxWidth:e.breakpoints.values.lg}),maxWidthXl:(0,r.Z)({},e.breakpoints.up("xl"),{maxWidth:e.breakpoints.values.xl})}}),{name:"MuiContainer"})(l)},4349:function(e,a,t){"use strict";t.r(a),t.d(a,{__N_SSG:function(){return N},default:function(){return y}});var n=t(5893),s=t(7294),r=t(3832),i=t(1163),o=t(8463),c=t(7462),d=t(5987),l=(t(5697),t(6010)),u=t(8786),p=t(2318),m=s.forwardRef((function(e,a){var t=e.action,n=e.avatar,r=e.classes,i=e.className,o=e.component,u=void 0===o?"div":o,m=e.disableTypography,f=void 0!==m&&m,h=e.subheader,v=e.subheaderTypographyProps,g=e.title,x=e.titleTypographyProps,Z=(0,d.Z)(e,["action","avatar","classes","className","component","disableTypography","subheader","subheaderTypographyProps","title","titleTypographyProps"]),b=g;null==b||b.type===p.Z||f||(b=s.createElement(p.Z,(0,c.Z)({variant:n?"body2":"h5",className:r.title,component:"span",display:"block"},x),b));var N=h;return null==N||N.type===p.Z||f||(N=s.createElement(p.Z,(0,c.Z)({variant:n?"body2":"body1",className:r.subheader,color:"textSecondary",component:"span",display:"block"},v),N)),s.createElement(u,(0,c.Z)({className:(0,l.Z)(r.root,i),ref:a},Z),n&&s.createElement("div",{className:r.avatar},n),s.createElement("div",{className:r.content},b,N),t&&s.createElement("div",{className:r.action},t))})),f=(0,u.Z)({root:{display:"flex",alignItems:"center",padding:16},avatar:{flex:"0 0 auto",marginRight:16},action:{flex:"0 0 auto",alignSelf:"flex-start",marginTop:-8,marginRight:-8},content:{flex:"1 1 auto"},title:{},subheader:{}},{name:"MuiCardHeader"})(m),h=t(9912),v=t(1120),g=t(7623),x=(0,v.Z)((function(e){return(0,g.Z)({card:{cursor:"pointer"}})})),Z=function(e){var a=e.post,t=(0,i.useRouter)(),s=x(),r="/posts/".concat(a.id);return(0,n.jsxs)(o.Z,{className:s.card,onClick:function(){return t.push(r)},children:[(0,n.jsx)(f,{title:a.title}),(0,n.jsx)(h.Z,{children:a.date})]})},b=(0,v.Z)((function(e){return(0,g.Z)({cardList:{display:"flex",flexDirection:"column",gap:e.spacing(2)}})})),N=!0,y=function(e){var a=e.posts,t=b();return(0,n.jsx)(r.Z,{children:(0,n.jsx)("div",{className:t.cardList,children:a.map((function(e){return(0,n.jsx)(Z,{post:e},e.id)}))})})}},1834:function(e,a,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/posts",function(){return t(4349)}])},1163:function(e,a,t){e.exports=t(4651)}},function(e){e.O(0,[774,888,179],(function(){return a=1834,e(e.s=a);var a}));var a=e.O();_N_E=a}]);