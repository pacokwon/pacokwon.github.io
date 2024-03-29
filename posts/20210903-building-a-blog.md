---
title: 'Building a Personal Blog in Next.js'
tags:
  - nextjs
  - en
---

In this post I'll be briefly going through how I built my blog with Next.js and some difficulties that I've faced. This will only be a personal reflection, not a tutorial.

So one day, I decided to build a personal blog. Nothing fancy but a rather simple blog to put my personal info with posting capability. Yes, you can use a given template, but I personally have this avoidance for templates. I wish to have complete control of what I use and build, and thus I decided to use a SSG/SSR framework called Next.js.

And so, here are the main tools/packages that I've used to build my blog:

- Next.js
- Remark / Rehype
- Material UI React
- GitHub Pages & Workflow
  I'll go through each of these to address my thoughts on them.

## Next.js

Next.js is a SSG/SSR framework for React. I haven't done SSG nor SSR ever before. It looked like Next.js and Gatsby both offer SSG functionality, so I had to choose. After a bit of research, I knew that Next.js would suit me better. To me Gatsby looked like a full fledged ecosystem with plugins and all, while Next.js was more like plug-and-play. It seemed like I would not have as much control over the project if I used Gatsby, so I chose Next.js. Of course, I haven't used Gatsby so there's the benefit of the doubt.

## Remark / Rehype

Remark / Rehype are libraries that transform markdown and html. I used these packages to convert them into React components, so that I could upload my posts.

The overall process of conversion is: `Markdown File - Remark - Rehype - React Component`. The markdown file is parsed with remark, translated to html using rehype, and then to a React component. The ecosystem allows you to plug processors in between. For example, I've used the `rehype-highlight` package that highlights code with `highlight.js` under the hood.

What I really liked about this package is that it allows users to use their own components for each html tag from markdown. For now, rounding corners in code blocks remain my only usage for this feature (...) but I'm sure I could do much more.

## Material UI React

Material UI component library provides many useful components that follow the Material UI design. _I like pretty things, but I don't like CSS._ This library is for me. The familiarity helps as well. Most (if not all) google products use this guideline. The documentation is top notch as well. It also allows easy custom styling.

## GitHub Pages & Workflow

I've used GitHub pages as my blog hosting service. It serves static assets for free. I heard good things about it, but have never used it before. I had some difficulty initially setting it up, only to find out that I haven't changed the branch for github pages.

Since generating static files requires a building process using Next.js, I have also set up GitHub Actions to automatically build as I push.

I hope to keep my blog minimal, but the minimum functionality will grow larger as the need arises. Eventually the stack will grow as well, and maybe I'll do version 2 of this post when it happens.
