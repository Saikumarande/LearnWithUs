'use strict';
(() => {
  const alphabet=['Apple','Bat','Cat','Dog','Elephant','Fish','Grapes','House','Ice cream','Juice','Kite','Lion','Mango','Nest','Orange','Pencil','Question mark','Rabbit','Sun','Tree','Umbrella','Violin','Watermelon','X-ray','Yo-yo','Zebra'].map((word,index)=>({word,image:'assets/alphabet/'+String.fromCharCode(97+index)+'.svg',category:'Picture words'}));
  const extra=[
    ['Bread','🍞','Food'],['Rice','🍚','Food'],['Milk','🥛','Food'],['Cheese','🧀','Food'],['Egg','🥚','Food'],['Cake','🍰','Food'],['Cookie','🍪','Food'],['Carrot','🥕','Food'],['Potato','🥔','Food'],['Tomato','🍅','Food'],['Onion','🧅','Food'],['Corn','🌽','Food'],['Peas','🫛','Food'],['Beans','🫘','Food'],['Lemon','🍋','Food'],['Peach','🍑','Food'],['Pear','🍐','Food'],['Plum','🟣','Food'],['Kiwi','🥝','Food'],['Guava','🍈','Food'],
    ['Tiger','🐯','Animals'],['Monkey','🐒','Animals'],['Kangaroo','🦘','Animals'],['Camel','🐫','Animals'],['Cow','🐄','Animals'],['Horse','🐴','Animals'],['Bear','🐻','Animals'],['Sheep','🐑','Animals'],['Goat','🐐','Animals'],['Fox','🦊','Animals'],['Wolf','🐺','Animals'],['Panda','🐼','Animals'],['Duck','🦆','Animals'],['Owl','🦉','Animals'],
    ['Book','📘','Everyday'],['Pen','🖊️','Everyday'],['Bag','🎒','Everyday'],['Chair','🪑','Everyday'],['Table','🛋️','Everyday'],['Door','🚪','Everyday'],['Window','🪟','Everyday'],['Clock','🕐','Everyday'],['Cup','☕','Everyday'],['Plate','🍽️','Everyday'],['Spoon','🥄','Everyday'],['Bed','🛏️','Everyday'],['Lamp','💡','Everyday'],['Ball','⚽','Everyday'],['Toy','🧸','Everyday'],['Box','📦','Everyday'],['Phone','📱','Everyday'],['Shoe','👟','Everyday'],['Sock','🧦','Everyday'],['Hat','🎩','Everyday'],
    ['Moon','🌙','World'],['Star','⭐','World'],['Cloud','☁️','World'],['Rain','🌧️','World'],['Flower','🌸','World'],['Leaf','🍃','World'],['River','🏞️','World'],['Hill','⛰️','World'],['Boat','⛵','World'],['Bus','🚌','World'],['Train','🚆','World'],['Bike','🚲','World'],['Plane','✈️','World'],['Car','🚗','World'],['Hand','✋','Body'],['Foot','🦶','Body'],['Eye','👁️','Body'],['Ear','👂','Body'],['Nose','👃','Body'],['Cap','🧢','Everyday']
  ].map(([word,emoji,category])=>({word,emoji,category}));
  window.LEARNWITHUS_WORD_BANK=[...alphabet,...extra];
})();
