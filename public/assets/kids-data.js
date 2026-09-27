'use strict';
(() => {
  const words=['Apple','Bat','Cat','Dog','Elephant','Fish','Grapes','House','Ice cream','Juice','Kite','Lion','Mango','Nest','Orange','Pencil','Question mark','Rabbit','Sun','Tree','Umbrella','Violin','Watermelon','X-ray','Yo-yo','Zebra'];
  const names=['ay','bee','see','dee','ee','eff','jee','aitch','eye','jay','kay','el','em','en','oh','pee','cue','ar','ess','tee','you','vee','double you','ex','why','zed'];
  const letters=words.map((word,i)=>({letter:String.fromCharCode(65+i),word,image:'assets/alphabet/'+String.fromCharCode(97+i)+'.svg'}));
  const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const ranges=['1-25','26-50','51-75','76-100'];
  const animals=[
    'Lion','Tiger','Cat','Dog','Elephant','Giraffe','Monkey','Zebra','Rabbit','Cow','Horse','Bear',
    'Pig','Sheep','Goat','Deer','Fox','Wolf','Panda','Koala','Kangaroo','Camel','Rhinoceros','Hippopotamus',
    'Gorilla','Llama','Chipmunk','Hedgehog','Otter','Sloth','Duck','Chicken','Penguin','Owl',
    'Turtle','Crocodile','Snake','Dolphin','Whale','Octopus'
  ].map(name=>({id:name.toLowerCase(),name,image:'assets/animals/'+name.toLowerCase()+'.svg'}));
  const letterStyles={
    upper:{label:'Capital letter',lower:false,cursive:false},
    lower:{label:'Small letter',lower:true,cursive:false},
    'cursive-upper':{label:'Cursive capital',lower:false,cursive:true},
    'cursive-lower':{label:'Cursive small letter',lower:true,cursive:true}
  };
  function normalizeLetterStyle(value){return value==='cursive'?'cursive-upper':Object.hasOwn(letterStyles,value)?value:'upper';}
  function numberName(n){return n<20?small[n]:n===100?'one hundred':tens[Math.floor(n/10)]+(n%10?'-'+small[n%10]:'');}
  function letterName(letter,accent='en-GB'){return letter==='Z'&&accent==='en-US'?'zee':names[letter.charCodeAt(0)-65];}
  function numberRange(n){return n<=25?'1-25':n<=50?'26-50':n<=75?'51-75':'76-100';}
  function normalizeNumberRange(value,n){if(ranges.includes(value))return value;const number=Number(n);if(Number.isInteger(number)&&number>=1&&number<=100)return numberRange(number);return value==='0-20'?'1-25':value==='21-50'?'26-50':value==='51-100'?'51-75':'1-25';}
  function lessonLink(mode,value,style='upper',range='1-25'){
    const query=new URLSearchParams({mode});
    if(mode==='animals'){query.set('animal',value);return 'children.html?'+query+'#animal-'+value;}
    if(mode==='numbers'){query.set('range',range);query.set('number',String(value));return 'children.html?'+query+'#number-'+value;}
    query.set('letter',value);if(mode==='letters')query.set('style',normalizeLetterStyle(style));
    return 'children.html?'+query+'#'+(mode==='words'?'word-':'letter-')+value;
  }
  window.LEARNWITHUS_KIDS={letters,animals,ranges,numberName,letterName,numberRange,normalizeNumberRange,lessonLink,letterStyles,normalizeLetterStyle};
})();
