import { Entity, EntityGroup, Component } from './lib/entity.js';

let E = new Entity('TestEntity', ['test'], ['uno', 'dos']);
console.assert(true == E.hasTags('uno'));
console.assert(true == E.hasTags(['uno', 'dos']));
console.assert(false == E.hasTags('oaw'));
console.assert(false == E.hasTags(['uno', 'dosss']));
E.addTags('tres');
E.addTags(['cuatro', 'cinco']);
console.assert(true == E.hasTags(['tres', 'cuatro', 'cinco']));
E.removeTags('tres');
console.assert(false == E.hasTags('tres'));
E.removeTags(['cuatro', 'cinco']);
console.assert(false == E.hasTags(['tres', 'cuatro', 'cinco']));

let T = Component.create('test');
console.assert(T.say() == 'TestEntity: Hello world');
console.assert(E.components.test.val == E.val);
E.name = 'Other';
E.val = 'CRAP, this changed!';
console.assert(E.components.test.val == E.val);
console.assert(E.val == 'CRAP, this changed!');
E.unknownProp = 'OAW';
console.assert(E.unknownProp == 'OAW');

Component.define('lepro', { a: 666, talk: () => "Hi, I'm lepro" });
let L = Component.create('lepro');
console.assert(L.talk() == "Hi, I'm lepro");
E.addComponents('lepro');
console.assert(E.talk() == "Hi, I'm lepro");
console.assert(E.a == 666);

let G = new EntityGroup();
let E1 = new Entity('p1', 'test');
G.add(E1);
G.add(new Entity('p2', 'test', ['uno']));
G.add([new Entity('p3', 'test', ['uno']), new Entity('p4', 'test')]);
console.assert(G.size() == 4);
console.assert(true === G.has(E1));
G.forEach(item => console.log(item.say()));
console.log(G.findTags('uno'));
console.log('Test ended');

/* console.assert(E.hasComponents("uno"))
console.assert(E.hasComponents(["uno", "dos"]))
console.assert(E.hasComponents("oaw"))
console.assert(E.hasComponents(["uno", "dosss"])) */
