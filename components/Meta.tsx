import React from 'react';
import Head from 'next/head';

type Props = {
  title: string;
  site_name?: string;
};

const Meta: React.FC<Props> = ({ title, site_name = "Paco Kwon's Blog" }) => (
  <Head>
    <title>{title}</title>
    <meta property="og:title" content={title} key="title" />
    <meta property="og:site_name" content={site_name} key="site_name" />
  </Head>
);

export default Meta;
