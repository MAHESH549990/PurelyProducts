import React from 'react';
import {Intro,Empty} from './ui';
export default function EmptyCartPage() { return <main className="section"><Intro title="Your bag" copy="Your next everyday favourite is waiting."/><Empty title="Your bag is empty" copy="Explore the collection and add something you love." link="/product"/></main>; }
