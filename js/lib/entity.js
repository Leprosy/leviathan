class Utils {
  static arrayfy(arg = '') {
    if (!Array.isArray(arg)) {
      arg = [arg];
    }

    return arg;
  }
}

export class Entity {
  constructor(name, components = [], tags = []) {
    this.id =
      new Date().getTime().toString(16) +
      Math.random()
        .toString(16)
        .replace('0.', '');
    this.name = name;
    this.components = {};
    this.addComponents(components);
    this.tags = new Set(tags);

    // Magic methods
    return new Proxy(this, {
      get: function(obj, prop) {
        if (prop in obj) {
          return obj[prop];
        }

        return obj._findPropComponent(prop)[prop];
      },

      set: function(obj, prop, value) {
        if (prop in obj) {
          obj[prop] = value;
        } else
          try {
            const component = obj._findPropComponent(prop);
            component[prop] = value;
          } catch (e) {
            obj[prop] = value;
          }

        return true;
      },
    });
  }

  _findPropComponent(prop) {
    const comps = Reflect.ownKeys(this.components);

    for (let i = 0; i < comps.length; ++i) {
      const component = this.components[comps[i]];

      if (prop in component) {
        return component;
      }
    }

    throw Error(`Property '${prop}' not found within entity components.`);
  }

  hasTags(tag = '') {
    tag = Utils.arrayfy(tag);
    return !tag.some(item => !this.tags.has(item));
  }

  hasComponents(cmp = '') {
    return true; // TODO: is this method needed?
  }

  addTags(tag = '') {
    // TODO: blank tags?
    tag = Utils.arrayfy(tag);
    tag.forEach(item => this.tags.add(item));
  }

  removeTags(tag = '') {
    tag = Utils.arrayfy(tag);
    tag.forEach(item => this.tags.delete(item));
  }

  equals(entity) {
    return this.id === entity.id;
  }

  set(obj) {
    const keys = Reflect.ownKeys(obj);
    keys.forEach(key => (this[key] = obj[key]));
  }

  addComponents(cmp = '') {
    cmp = Utils.arrayfy(cmp);
    cmp.forEach(item => {
      this.components[item] = Component.create(item);

      if (typeof this.components[item].init === 'function') {
        this.components[item].init.bind(this).call();
      }
    });
  }
}

export class EntityGroup {
  constructor() {
    this.entities = new Set();
  }

  forEach(call) {
    this.entities.forEach(item => call(item));
  }

  add(ents) {
    ents = Utils.arrayfy(ents);
    ents.forEach(item => this.entities.add(item));
  }

  remove(ents) {
    ents = Utils.arrayfy(ents);
    ents.forEach(item => this.entities.delete(item));
  }

  removeAll() {
    this.entities.forEach(item => this.remove(item));
  }

  has(ent) {
    ent = Utils.arrayfy(ent);
    return !ent.some(item => !this.entities.has(item));
  }

  findTags(tag, hasTag = true) {
    tag = Utils.arrayfy(tag);
    let result = new EntityGroup();

    this.entities.forEach(item => {
      if (item.hasTags(tag) === hasTag) {
        result.add(item);
      }
    });

    return result;
  }

  size() {
    return this.entities.size;
  }
}

let comps = {
  test: {
    init: function() {
      //console.log('test component init // context =>', this);
    },
    remove: function() {
      //console.log('test component remove');
    },
    name: 'TestComponent',
    val: 'Value',
    say: function() {
      return this.name + ': Hello world';
    },
    this1: function() {
      return this;
    },
    this2: () => this,
  },
};

export class Component {
  static create(objName) {
    if (Reflect.has(comps, objName)) {
      let newObj = {};
      Component._extend(newObj, comps[objName]);
      return newObj;
    } else {
      throw Error(`Component not registered: '${objName}'`);
    }
  }

  static define(objName, objDef) {
    comps[objName] = objDef;
  }

  static _extend(newObj, source) {
    var keys = Object.keys(source);

    for (var i = 0; i < keys.length; ++i) {
      if (Array.isArray(source[keys[i]])) {
        newObj[keys[i]] = [];
      } else {
        newObj[keys[i]] = source[keys[i]];
      }
    }
  }
}
