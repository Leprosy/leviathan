import { Entity, EntityGroup, Component } from '../js/lib/entity.js';

describe('Base test suite', function() {
  let E = new Entity('TestEntity', ['test'], ['uno', 'dos']);

  it('will test Entity tags', function() {
    expect(E.hasTags('uno')).toBe(true);
    expect(E.hasTags(['uno', 'dos'])).toBe(true);
    expect(E.hasTags('oaw')).toBe(false);
    expect(E.hasTags(['uno', 'tres'])).toBe(false);
    E.addTags('tres');
    E.addTags(['cuatro', 'cinco']);
    expect(E.hasTags(['tres', 'cuatro', 'cinco'])).toBe(true);
    E.removeTags('tres');
    expect(E.hasTags('tres')).toBe(false);
    E.removeTags(['cuatro', 'cinco']);
    expect(E.hasTags(['tres', 'cuatro', 'cinco'])).toBe(false);
  });

  it('will test Component behavior', function() {
    let T = Component.create('test');
    expect(T.say()).toBe('TestComponent: Hello world');
    expect(E.say()).toBe('TestEntity: Hello world');
    expect(E.components.test.val).toBe(E.val);
    E.name = 'NewName';
    E.val = 'NewValue';
    expect(E.components.test.val).toBe(E.val);
    expect(E.val).toBe('NewValue');
    expect(E.components.test.name).not.toBe(E.name);
    E.unknownProp = 'NewProp';
    expect(E.unknownProp).toBe('NewProp');
  });
});
/*


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
console.log(G.findTags('uno', false)); // list of entities without the tags

console.log('Test ended'); 
*/
