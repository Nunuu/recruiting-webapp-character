import { useState, useMemo } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';

const initAttrVals = ATTRIBUTE_LIST.reduce((obj, attribute) => {
  obj[attribute] = {
    value: 10,
    modifier: 0,
  }
  return obj;
}, {});

function App() {
  const [attrVals, setAttrVals] = useState(initAttrVals);

  const updateAttrVal = (key, valueChange) => {
    if (valueChange > 0) {
      const attrSum = Object.values(attrVals).reduce((sum, { value }) => sum + value, 0);
      if (attrSum >= 70) {
        alert('Max attribute points reached');
        return;
      }
    }

    const copy = {...attrVals};
    const value = Math.max(copy[key].value + valueChange, 0);
    const modifier = calModifier(value);
    setAttrVals({
      ...copy, 
      [key]: { value, modifier }
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Ying He</h1>
      </header>
      <section className="App-section">
        <Attributes values={attrVals} onInc={(key) => updateAttrVal(key, 1)} onDec={(key) => updateAttrVal(key, -1)}/>
        <CharClasses attrVals={attrVals}/>
        <Skills attrVals={attrVals}/>
      </section>
    </div>
  );
}

function Attributes({values, onInc, onDec}) {
  return <>
    <h2>Attributes</h2>
    <ul>
    {
      Object.keys(values).map((attribute) => {
        return <li key={attribute}>
          {attribute}: {values[attribute].value}
          (modifier: {values[attribute].modifier})
          <button onClick={() => onInc(attribute)}>+</button>
          <button onClick={() => onDec(attribute)}>-</button>
        </li>
      })
    }
    </ul>
  </>
}

function CharClasses({attrVals}) {
  const [requirements, setRequirements] = useState(undefined);

  const displayMinAttrs = (charClass) => {
    setRequirements({
      class: charClass,
      attributes: CLASS_LIST[charClass]
    });
  };

  return <>
    <h2>Classes</h2>
    <ul>
      {
        Object.keys(CLASS_LIST).map((charClass) => {
          const matches = matchesClass(CLASS_LIST[charClass], attrVals);
          return <li key={charClass}>
            <button className={matches ? 'matches' : undefined} onClick={() => displayMinAttrs(charClass)}>{charClass}</button>
          </li>
        })
      }
    </ul>
    {requirements && <>
      <h2>Requirements for {requirements.class}:</h2>
      {JSON.stringify(requirements.attributes)}
    </>}
  </>
}

const initSkillVals = SKILL_LIST.reduce((obj, skill) => {
  obj[skill.name] = {
    attributeModifier: skill.attributeModifier,
    value: 0,
  }
  return obj;
}, {});

function Skills({attrVals}) {
  const [skillVals, setSkillVals] = useState(initSkillVals);

  const total = useMemo(() => {
    const intModifier = attrVals['Intelligence'].modifier;
    return Math.max(10 + 4 * intModifier, 0);
  }, [attrVals]);

  const updateSkillVal = (key, valueChange) => {
    if (valueChange > 0) {
      const allSkillPoints = Object.keys(skillVals).reduce((sum, key) => sum + skillVals[key].value, 0);
      if (allSkillPoints >= total) {
        alert('Max skill points reached, upgrade INT to get more!');
        return;
      }
    }

    const copy = {...skillVals};
    const value = Math.max(copy[key].value + valueChange, 0);
    setSkillVals({
      ...copy, 
      [key]: { ...copy[key], value }
    });
  }

  return <>
    <h2>Skills</h2>
    <p>Total skill points: {total}</p>
    <ul>
      {Object.keys(skillVals).map((key) => {
        const attrMod = skillVals[key].attributeModifier;
        return <li key={key}>
          {key} - points: {skillVals[key].value}
          <button onClick={() => updateSkillVal(key, 1)}>+</button>
          <button onClick={() => updateSkillVal(key, -1)}>-</button>
          (modifier: {attrMod} {attrVals[attrMod].modifier})
          total: {skillVals[key].value + attrVals[attrMod].modifier}
        </li>
      })}
    </ul>
  </>
}

function matchesClass(criteria, currentVals) {
  return Object.keys(criteria).reduce((result, key) => {
    return result && currentVals[key].value >= criteria[key];
  }, true);
}

function calModifier(value) {
  return Math.floor((value - 10) / 2);
}

export default App;
