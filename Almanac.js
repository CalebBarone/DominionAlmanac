let scrollPos;
addEventListener("load", function()
{
    document.getElementById("Search").addEventListener("input", Search)
    document.getElementById("Search").addEventListener("keypress", GoTo)
    document.getElementById("Back").addEventListener("click", Back)
    document.getElementById("Back").classList.add("hide");
    document.getElementById("Info").classList.add("hide");
    document.addEventListener("deviceready", DReady)

    Populate();
});

function DReady()
{
   document.addEventListener("backbutton", onBackKeyDown)
}

function onBackKeyDown()
{
   Back()
}

function Populate(f)
{
    let cards = {}
    document.getElementById("Cards").innerHTML = "";
    if(f)
    {
        const filter = f.toLowerCase();
        cards = Cards.filter((c) => c.Name.toLowerCase().includes(filter) || c.Type.some((e) => e.toLowerCase().includes(filter)) || c.Expansion.toLowerCase().includes(filter))
    }
    else
    {
        cards = Cards
    }

    const div = document.getElementById("Cards");
    for(const card of cards)
    {
        const c = document.createElement("div");
        c.classList.add("Card");
        c.innerHTML = `${card.Name}`;

        const TypeList = card.Type.filter((e) =>  e !== "Attack" && e !== "Augur" && e !== "Liaison" && e !== "Traveller" && e !== "Odyssey" &&
        e !== "Reserve" && e !== "Reward"  && e !== "Doom" && e !== "Clash" && e !== "Knight" && e !== "Looter" && e !== "Prize" && e !== "Wizard" && e !== "Command"
        && e !== "Fort" && e !== "Fate" && e !== "Gathering" && e !== "Spirit" && e !== "Townsfolk" && e !== "Castle" && e !== "Zombie" && e !== "Heirloom" && e !== "Loot");

        //card background
        if(TypeList.length > 1)
        {
            if(TypeList[0] === "Action")
            {
                if(TypeList.length > 2)
                {
                    c.style.backgroundImage = `linear-gradient(${Colors[TypeList[1]]} 50%, ${Colors[TypeList[2]]} 50%, ${Colors[TypeList[2]]})`;
                }
                else
                    switch(TypeList[1])
                    {
                        case "Treasure":
                        case "Shelter":
                        case "Victory":
                            c.style.backgroundImage = `linear-gradient(${Colors[TypeList[0]]} 50%, ${Colors[TypeList[1]]} 50%, ${Colors[TypeList[1]]})`;
                            break;
                        case "Night":
                            c.style.backgroundColor = Colors[TypeList[0]];
                            break;
                        default:
                            c.style.backgroundColor = Colors[TypeList[1]];
                            break;
                    }
                    
            }
            else if(TypeList[0] === "Night")
            {
                if(TypeList[1] === "Duration")
                {
                    c.style.backgroundColor = Colors[TypeList[1]];
                }
                else
                {
                    c.style.backgroundColor = Colors[TypeList[0]];
                    c.style.color = "#ffffff";
                }
            }
            else if(TypeList.includes("Shelter"))
            {
                c.style.backgroundImage = `linear-gradient(${Colors[TypeList[0]]} 50%, ${Colors[TypeList[1]]} 50%, ${Colors[TypeList[1]]})`;
            }
            else
                c.style.backgroundImage = `linear-gradient(${Colors[TypeList[0]]} 50%, ${Colors[TypeList[1]]} 50%, ${Colors[TypeList[1]]})`;
        }
        else
        {
            c.style.backgroundColor = Colors[TypeList[0]];
            if(TypeList[0] === "Night")
                c.style.color = "White";
        }
        
        c.addEventListener("click", Select);
        div.append(c);
    }
}

function Search()
{
    if(!document.getElementById("Info").classList.contains("hide"))
    {
        Back();
    }
    Populate(document.getElementById("Search").value)
}

function Select(ev, name)
{
   scrollPos = window.scrollY;

   let card;
   if(ev)
   {
      card = Cards.find((e) => e.Name === ev.target.innerHTML);
   }
   else
   {
      card = Cards.find((e) => e.Name === name);
   }
   document.getElementById("Cards").classList.add("hide");
   document.getElementById("Back").classList.remove("hide");
   document.getElementById("Info").classList.remove("hide");
   document.getElementById("InfoName").innerHTML = "Name: " + card.Name
   document.getElementById("InfoCost").innerHTML = "Cost: " + costImage(card.Cost);
   document.getElementById("InfoEx").innerHTML = "Expansion: " + card.Expansion;
   document.getElementById("InfoFAQ").innerHTML = ParseFAQ(card.FAQ);
   document.getElementById("InfoTypes").innerHTML = "Type: "
   card.Type.forEach((el, x, arr) => document.getElementById("InfoTypes").innerHTML += x < arr.length - 1 ? el + ", " : el)
   document.getElementById("InfoCard").innerHTML = cardImage(card.Name, card.Type[0]);

   window.scroll(0,0);

}

function Back()
{
   document.getElementById("Cards").classList.remove("hide");
   document.getElementById("Back").classList.add("hide");
   document.getElementById("Info").classList.add("hide");
   document.getElementById("InfoName").innerHTML = "";
   document.getElementById("InfoTypes").innerHTML = "";
   document.getElementById("InfoEx").innerHTML = "";
   document.getElementById("InfoCost").innerHTML = "";
   document.getElementById("InfoFAQ").innerHTML = "";
   document.getElementById("InfoCard").innerHTML = "";
   window.scroll(0,scrollPos);

}

function costImage(cost)
{
   if(!cost)
      return "None";
   let final = "";
   if(cost.includes("d"))
   {
      let costArr = cost.split("d")
      if(costArr[0] !== "")
      {
         final += `<img class="CostImg" src="./Images/16px-Coin${costArr[0]}.png">`;
      }
      final += `<img class="CostImg" src="./Images/18px-Debt${costArr[1]}.png">`
   }
   else if(cost.includes("p"))
   {
      cost = cost.replace("p", "")
      if(cost !== "")
      {
         final += `<img class="CostImgWide" src="./Images/16px-Coin${cost}.png">`;
      }
      final += `<img class="CostImg" src="./Images/10px-Potion.png">`;
   }
   else
   {
      final += `<img class="CostImg" src="./Images/16px-Coin${cost}.png">`;
   }
   return final
}

function cardImage(name, type)
{
   name = name.replaceAll(" ", "_")
   switch(type)
   {
      case "Event":
      case "Project":
      case "Landmark":
      case "State":
      case "Ally":
      case "Trait":
      case "Hex":
      case "Artifact":
      case "Boon":
      case "Way":
         return `<img class="CardImgWide" src="./Images/320px-${name}.jpg">`;
      default:
         return `<img class="CardImg" src="./Images/200px-${name}.jpg">`;
   }
   
}

function ParseFAQ(faq)
{
   let splitFAQ = faq.split("^");
   let final = "";
   for(i = 0; i < splitFAQ.length; ++i)
   {
      if(splitFAQ[i].startsWith("COIN"))
      {
         temp = splitFAQ[i].replace("COIN", "");
         final += `<img class="TextCoin" src="./Images/16px-Coin${temp}.png">`
      }
      else if(splitFAQ[i].startsWith("DEBT"))
      {
         temp = splitFAQ[i].replace("DEBT", "");
         final += `<img class="TextCoin" src="./Images/18px-Debt${temp}.png">`
      }
      else if(splitFAQ[i].startsWith("VP"))
      {
         temp = splitFAQ[i].replace("VP", "");
         final += `<img class="TextCoin" src="./Images/14px-VP.png">`
      }
      else if(splitFAQ[i].startsWith("POTION"))
      {
         temp = splitFAQ[i].replace("POTION", "");
         final += `<img class="TextCoin" src="./Images/10px-Potion.png">`
      }
      else
      {
         final += splitFAQ[i];
      }
   }

   return final;
}

function GoTo(ev)
{
   if(ev.key === "Enter")
   {
      ev.preventDefault();
      Select(null,document.getElementById("Cards").firstChild.innerHTML);
   }
}

const Colors = 
{
    Action: "#EEEEEE",
    Treasure: "#FFCF72",
    Duration: "#F58E32",
    Victory: "#8FD082",
    Reaction: "#059CE4",
    Night: "#444444",
    Ruins: "#B5651D",
    Shelter: "#F68181",

    //One Taggers
    Ally: "#FFD59A",
    Artifact: "#FFB347",
    Boon: "#FFC000",
    Curse: "#D0ADE3",
    Event: "#BBBBBB",
    Landmark: "#95F671",
    Hex: "#D0ADE3",
    Project: "#EE888B",
    State: "#F5D2D2",
    Trait: "#C8A2C8",
    Way: "#BDF6FE"
}

const Cards = 
[
    {
      "Name": "Alms",
      "Cost": "0",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Amulet",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Artificer",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Ball",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Bonfire",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Borrow",
      "Cost": "0",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Bridge Troll",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Caravan Guard",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration",
         "Reaction"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Champion",
      "Cost": "6",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Coin of the Realm",
      "Cost": "2",
      "Type": [
         "Treasure",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Disciple",
      "Cost": "5",
      "Type": [
         "Action",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Distant Lands",
      "Cost": "5",
      "Type": [
         "Action",
         "Reserve",
         "Victory"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Dungeon",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Duplicate",
      "Cost": "4",
      "Type": [
         "Action",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Expedition",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Ferry",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Fugitive",
      "Cost": "4",
      "Type": [
         "Action",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Gear",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Giant",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Guide",
      "Cost": "3",
      "Type": [
         "Action",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Haunted Woods",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Hero",
      "Cost": "5",
      "Type": [
         "Action",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Hireling",
      "Cost": "6",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Inheritance",
      "Cost": "7",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Lost Arts",
      "Cost": "6",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Lost City",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Magpie",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Messenger",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Miser",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Mission",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Page",
      "Cost": "2",
      "Type": [
         "Action",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Pathfinding",
      "Cost": "8",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Peasant",
      "Cost": "2",
      "Type": [
         "Action",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Pilgrimage",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Plan",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Port",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Quest",
      "Cost": "0",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Raid",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Ranger",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Ratcatcher",
      "Cost": "2",
      "Type": [
         "Action",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Raze",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Relic",
      "Cost": "5",
      "Type": [
         "Treasure",
         "Attack"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Royal Carriage",
      "Cost": "5",
      "Type": [
         "Action",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Save",
      "Cost": "1",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Scouting Party",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Seaway",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Soldier",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Storyteller",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Swamp Hag",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Duration"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Teacher",
      "Cost": "6",
      "Type": [
         "Action",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Trade",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Training",
      "Cost": "6",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Transmogrify",
      "Cost": "4",
      "Type": [
         "Action",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Travelling Fair",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Treasure Hunter",
      "Cost": "3",
      "Type": [
         "Action",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Treasure Trove",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Warrior",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack",
         "Traveller"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Wine Merchant",
      "Cost": "5",
      "Type": [
         "Action",
         "Reserve"
      ],
      "Expansion": "Adventures",
      "FAQ": "..."
   },
    {
      "Name": "Alchemist",
      "Cost": "3p",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- At the start of your Clean-up phase, before you discard any cards from your play area, if you have at least one Potion in play you may move Alchemist from your play area to the top of your deck. This is optional.<br>- Since this happens at the start of Clean-up, under ordinary circumstances this means that the Alchemist will be in the new hand you draw at the end of Clean-up.<br>- If you have multiple Alchemists and a Potion, you can put any or all of the Alchemists on top of your deck.<br>- You do not have to have used the Potion to buy anything; you only need to have played it.<br>- You can topdeck all your Alchemists, and then topdeck your Potion with Herbalist.<br>- However, if you play a Potion but then remove it from the play area before Clean-up, such as by trashing it with Counterfeit, it is no longer in play and will not allow you to topdeck your Alchemists."
   },
    {
      "Name": "Apothecary",
      "Cost": "2p",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- You draw a card and get +1 Action first.<br>- Then reveal the top four cards of your deck, put the revealed Coppers and Potions into your hand, and put the other cards back on your deck in any order.<br>- You cannot choose not to take all of the Coppers and Potions."
   },
    {
      "Name": "Apprentice",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- If you trash a card costing ^COIN0^, such as Curse or Copper, you do not draw any cards.<br>- Otherwise you draw a card per ^COIN1^ the card you trashed cost, and another two cards if it had ^POTION^ in its cost. For example if you trashed a Golem, which costs ^COIN4^^POTION^, you would draw 6 cards.<br>- If you trash a card with ^DEBT^ in the cost, the ^DEBT^ component is ignored."
   },
    {
      "Name": "Familiar",
      "Cost": "3p",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- You draw a card, get +1 Action, and each other player gains a Curse."
   },
    {
      "Name": "Golem",
      "Cost": "4p",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- Reveal cards from the top of your deck, one at a time, until you have revealed two Action cards that are not Golem.<br>- Discard all of the revealed cards except for the non-Golem Actions you found. If you did not find any, you are done.<br>- If you found one, play it. If you found two, play them both, in either order. You cannot choose not to play one of them.<br>- These Action cards are not in your hand and so are unaffected by things that look for cards in your hand. For example if one of them is Throne Room, you cannot use it on the other one."
   },
    {
      "Name": "Herbalist",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- When you play this, you get +1 Buy and +^COIN1^, and set up an effect to happen later in the turn; once, when you discard a Treasure card from play, you can put it onto your deck.<br>- Herbalist is cumulative; if you play two Herbalists, or Throne Room a Herbalist, you can put up to two discarded Treasures onto your deck.<br>- If you have Capitalism, Herbalist can put itself onto your deck.<br>- If a Treasure isn't getting discarded from play this turn (such as an Astrolabe, or a Crown that's staying in play with a Duration), you can't put it on your deck with Herbalist.<br>- If you topdeck a Treasure that does something when you discard it from play (e.g. Capital), you still have to do its ability.<br>- Herbalist cannot topdeck a Treasure that leaves play in any way other than by being discarded, such as Spoils, Stockpile, or any Treasure trashed by Counterfeit."
   },
    {
      "Name": "Philosopher's Stone",
      "Cost": "3p",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- When you play this, count the number of cards in your deck and discard pile combined, divide by 5, and round down. That is how many ^COIN^ this produces for you.<br>- Once played, the amount of ^COIN^ you got does not change even if the number of cards changes later in the turn.<br>- Make sure not to change the order of your deck when counting it; the order of your discard pile does not matter.<br>- You will get to look through your discard pile as you count it.<br>- You only count your deck and discard pile, not your hand or cards in play or set aside cards.<br>- It is sometimes possible to play multiple copies of Philosopher's Stone that give different amounts of ^COIN^. For example, if you have 20 cards in your deck and play this, it produces ^COIN4^. Then, you could play a Crystal Ball (from Prosperity), which could cause you to reveal and play another copy of this. When you play the second copy, you would only have 19 cards in your deck, so it would only produce ^COIN3^."
   },
    {
      "Name": "Possession",
      "Cost": "6p",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- Possession has received errata so that you can't take multiple extra turns in a row [1]. Here are rulings that will change as a result.<br>- E2: If you play Possession multiple times in one turn, the next player can't take more than 2 turns in a row, so all Possessions after the first will fail.<br>- E1: If you are Possessed, and they make you play Possession, you Possess the next player, and then take your normal turn.<br>- You are not taking a turn with the deck of the player to your left†; that player is taking a turn, with you making the decisions and gaining the cards. The “you” in all cards still refers to the player being Possessed, not the player doing the Possessing.<br>- Possession has several pieces to it:<br>&nbsp;&nbsp;- You can see the Possessed player's cards for the entire turn, which means you will see their next hand during Clean-up. You will also see any cards they are entitled to see due to card rules; for example you can look at cards they have set aside with Native Village (from Dominion: Seaside).<br>&nbsp;&nbsp;- You make all decisions for the Possessed player, including what cards to play, decisions those cards provide, and what cards to buy.<br>&nbsp;&nbsp;- Any cards the Possessed player would have gained in any way, you gain instead; this includes cards bought, as well as cards gained due to Actions. The cards you gain this way go to your discard pile, even if they would have gone to that player's hand or the top of their deck or somewhere else. You also get any D tokens that player would have gotten (this is a change from the original version of Possession). You do not get any other tokens that player would have gotten (this is a change from an earlier version). D is something from Dominion: Empires; if you do not have those cards, that part of Possession's effects does not matter.<br>&nbsp;&nbsp;- During the Possessed turn, whenever one of that player's cards is trashed, set it aside, and that player puts it into their discard pile at the end of the turn, after Clean-up. The card is still trashed, so for example you could have them trash a Mining Village (from Dominion: Intrigue) and get the +$2. Getting those cards back at end of turn does not count as those cards being gained (so for example, you will not get them). Other players' cards that are trashed during that turn are not returned.<br>&nbsp;&nbsp;- Cards passed with Masquerade (from Dominion: Intrigue) are not being gained or trashed. Exchanging a card (such as Soldier from Adventures) does not count as gaining or trashing. Cards returned to the Supply, such as with Ambassador (from Dominion: Seaside) are also not being trashed, and so return to the Supply normally.<br>&nbsp;&nbsp;- If you make another player play an Attack via Possession, that Attack will hit you like it would normally. If you want to use a Reaction in response to that Attack (such as Moat), you would be the one revealing the Reaction, not the player being Possessed.<br>&nbsp;&nbsp;- Possession causes an extra turn to be played, like the card Outpost does (from Dominion: Seaside). The extra turn happens only after this turn is completely over - you will have discarded everything and drawn your next hand. Outpost only prevents itself from giving a player two consecutive turns, it does not prevent other cards or the rules from doing so. So for example if you play Possession in a two-player game, then after the Possession turn, that player still gets their normal turn. If they played Outpost during that turn though, it would not give them an extra turn (unless another player took a turn in between, such as via another Possession). If you play both Outpost and Possession in the same turn, the Outpost turn happens first. If you make someone play Outpost during a turn in which you Possessed them, that player will get the extra turn and make decisions during it and so forth, not you; if you make someone play Possession during a turn in which you Possessed them, that will make that player Possess the player to their left, rather than you getting to Possess anyone further. Possession turns (and other extra turns) do not count for the tiebreaker. Once the game ends, no further turns are played, including extra turns from Possession and Outpost.<br>&nbsp;&nbsp;- Unlike Outpost, Possession is not a Duration card. It is discarded in the Clean-up phase of the turn you played it.<br>&nbsp;&nbsp;- Possession is cumulative; if you play it twice in one turn, there will be two extra turns after this one.<br>- Possession is not an Attack, and cannot be blocked by cards like Moat.<br>- In a 2-player game, if you make your opponent play Possession during a Possession turn, your opponent takes their normal turn and then you next take an extra turn with your opponent making all decisions.<br>&nbsp;&nbsp;- If you make the Possessed player play Possession during one of their Possession turns, you finish all Possession turns of the current Possessed player and their normal turn before moving on to the next player's Possession turns. Extra turns happen in turn order.<br>&nbsp;&nbsp;- Possession does not give control between turns. For example, if you play 2 Possessions, then make the Possessed player play Outpost during the first Possession turn, they decide whether the next turn is the other Possession turn, or the Outpost or Mission turn.<br>- If you were Possessed before your normal turn, and you play an early version of Outpost or buy an early version of Mission during your normal turn, you will not take an extra turn.<br>- Cards that are trashed and set aside during a Possession turn are not in the trash for the rest of the turn. which may matter for Necromancer or Graverobber. If you trash a Fortress during a Possession turn, you choose to either put it into your hand, or to set it aside, at which point it stops moving.<br>- When they would gain a card, they do not resolve its when-gain abilities; you do. So if you make them gain a Spices, you get the +2 Coffers and not them.<br>&nbsp;&nbsp;- Note that some cards care if you gain a card by buying it (e.g. Haggler); these abilities will never trigger on a Possession turn. This also means that if you make them buy a card and overpay for it (e.g. Stonemason), that ability never triggers.<br>- Since they can't gain any cards on the Possession turn, anything that cared about how many cards were gained (such as Cauldron and Labyrinth) will never trigger.<br>- If a gainer cares about what card they gained, these cards didn't gain a card, and so will do nothing. For example, if you Possess someone and have them play a Replace and gain a Province, they didn't gain a Victory card, so no Curses are given out.<br>- If they would gain a card to somewhere other than their discard pile (e.g. they would gain a Horse onto their deck with Supplies), the gained card is instead gained to your discard pile. The exception to this rule is cards which gain themselves to a particular location (like Guardian or Den of Sin)."
   },
    {
      "Name": "Potion",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- This is a basic Treasure card. It costs ^COIN4^ and produces ^POTION^.<br>- It is not a Kingdom card; see the Preparation rules."
   },
    {
      "Name": "Scrying Pool",
      "Cost": "2p",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- First each player reveals their top card, and discards it or puts it back, with you choosing separately for each player.<br>- If people care about the order, go clockwise, starting with yourself.<br>- After that, reveal cards from the top of your deck until you reveal a card that is not an Action card.<br>- If you run out of cards without revealing a [non-]Action card, shuffle your discard pile and keep going. If you have no discard pile left either, stop there.<br>- Put all of the Action cards you revealed from your deck into your hand, plus that first non-Action card.<br>- There is a typo in the official FAQ; it says \"Action card\" where it should say \"non-Action card\". That error is corrected above.<br>- Cards with multiple types, one of which is Action, are Actions.<br>- The only cards that go into your hand are the ones revealed as part of revealing cards until finding a non-Action; you do not get discarded cards from the first part of what Scrying Pool did, or cards from other players' decks."   },
    {
      "Name": "Transmute",
      "Cost": "p",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- If you trash a Curse to this, you do not get anything.<br>- If you trash a card with more than one type to this, you get each applicable thing. For example if you trash an Action-Victory card (such as Nobles, from Dominion: Intrigue), you gain both a Duchy and a Gold.<br>- If you Transmute an Estate under the influence of Inheritance, you will gain a Gold (for trashing a Victory card) and a Duchy (for trashing an Action card)."
   },
    {
      "Name": "University",
      "Cost": "2p",
      "Type": [
         "Action"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- Gaining an Action card is optional.<br>- Cards with ^POTION^ in their cost cannot be gained by this.<br>- Cards with multiple types, one of which is Action, are Actions and can be gained this way."
   },
    {
      "Name": "Vineyard",
      "Cost": "p",
      "Type": [
         "Victory"
      ],
      "Expansion": "Alchemy",
      "FAQ": "- This is worth 1^VP^ per 3 Action cards you have, rounded down; for example if you have 11 Action cards, your Vineyards are worth 3^VP^ each.<br>- Cards with multiple types, one of which is Action, are Actions and so are counted by Vineyard."
   },
    {
      "Name": "Acolyte",
      "Cost": "4",
      "Type": [
         "Action",
         "Augur"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Archer",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack",
         "Clash"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Architects' Guild",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Band of Nomads",
      "Cost": "5",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Barbarian",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Battle Plan",
      "Cost": "3",
      "Type": [
         "Action",
         "Clash"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Bauble",
      "Cost": "2",
      "Type": [
         "Treasure",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Blacksmith",
      "Cost": "3",
      "Type": [
         "Action",
         "Townsfolk"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Broker",
      "Cost": "4",
      "Type": [
         "Action",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Capital City",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Carpenter",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Cave Dwellers",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Circle of Witches",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "City-state",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Coastal Haven",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Conjurer",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration",
         "Wizard"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Contract",
      "Cost": "5",
      "Type": [
         "Treasure",
         "Duration",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Courier",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Crafters' Guild",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Desert Guides",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Distant Shore",
      "Cost": "6",
      "Type": [
         "Action",
         "Victory",
         "Odyssey"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Elder",
      "Cost": "5",
      "Type": [
         "Action",
         "Townsfolk"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Emissary",
      "Cost": "5",
      "Type": [
         "Action",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Family of Inventors",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Fellowship of Scribes",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Forest Dwellers",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Galleria",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Gang of Pickpockets",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Garrison",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration",
         "Fort"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Guildmaster",
      "Cost": "5",
      "Type": [
         "Action",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Herb Gatherer",
      "Cost": "3",
      "Type": [
         "Action",
         "Augur"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Highwayman",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Hill Fort",
      "Cost": "5",
      "Type": [
         "Action",
         "Fort"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Hunter",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Importer",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Innkeeper",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Island Folk",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "League of Bankers",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "League of Shopkeepers",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Lich",
      "Cost": "6",
      "Type": [
         "Action",
         "Wizard"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Market Towns",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Marquis",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Merchant Camp",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Miller",
      "Cost": "4",
      "Type": [
         "Action",
         "Townsfolk"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Modify",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Mountain Folk",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Old Map",
      "Cost": "3",
      "Type": [
         "Action",
         "Odyssey"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Order of Astrologers",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Order of Masons",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Peaceful Cult",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Plateau Shepherds",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Royal Galley",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Sentinel",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Sibyl",
      "Cost": "6",
      "Type": [
         "Action",
         "Augur"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Skirmisher",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Sorcerer",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Wizard"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Sorceress",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Augur"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Specialist",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Stronghold",
      "Cost": "6",
      "Type": [
         "Action",
         "Victory",
         "Duration",
         "Fort"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Student",
      "Cost": "3",
      "Type": [
         "Action",
         "Wizard",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Sunken Treasure",
      "Cost": "5",
      "Type": [
         "Treasure",
         "Odyssey"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Swap",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Sycophant",
      "Cost": "2",
      "Type": [
         "Action",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Tent",
      "Cost": "3",
      "Type": [
         "Action",
         "Fort"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Territory",
      "Cost": "6",
      "Type": [
         "Victory",
         "Clash"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Town",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Town Crier",
      "Cost": "2",
      "Type": [
         "Action",
         "Townsfolk"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Trappers' Lodge",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Underling",
      "Cost": "3",
      "Type": [
         "Action",
         "Liaison"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Voyage",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration",
         "Odyssey"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Warlord",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Attack",
         "Clash"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Woodworkers' Guild",
      "Type": [
         "Ally"
      ],
      "Expansion": "Allies",
      "FAQ": "..."
   },
    {
      "Name": "Bureaucrat",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Base",
      "FAQ": "- A player with no cards in their deck will have the card they put on top become the only card in their deck."
   },
    {
      "Name": "Cellar",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- Choose any number of cards from your hand; discard them all at once; then draw as many cards as you actually discarded.<br>- If this causes you to shuffle, you will shuffle in the cards you discarded.<br>- You do not have to let players see any but the top card discarded; however the number of cards you discard is public.<br>- You cannot discard the Cellar itself, since it is not in your hand after you play it."
   },
    {
      "Name": "Chapel",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You cannot trash the Chapel itself, since it is not in your hand after you play it.<br>- You don't have to trash any cards; zero is included in \"up to four\". This may be relevant if you are forced to play Chapel (for example, as a result of playing Herald) and don't have anything you want to trash.<br>- When you trash any cards with \"when you trash this\" abilities, you trash all the cards first, then pick an order to resolve things that happen due to trashing them."
   },
    {
      "Name": "Copper",
      "Cost": "0",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Base",
      "FAQ": ""
   },
    {
      "Name": "Council Room",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- The other players draw a card whether they want to or not."
   },
    {
      "Name": "Curse",
      "Cost": "0",
      "Type": [
         "Curse"
      ],
      "Expansion": "Base",
      "FAQ": "- The number of Curses in the Supply is 10 for each player beyond the first—10 for two players, 20 for three players, 30 for four players, and so on.<br>- Curses are always in the supply, even when there is no card which explicitly mentions them.<br>- Curse isn't a Victory card, even though (like most Victory cards) it is a dead card that affects your score.<br>- In games using Charlatan, Curses behave differently than usual: they are still worth -1 VP, but in these games they also function as Treasures that can be played for +$1. This applies for the entire game and in all situations; it's just like the bottom bar says \"Curse - Treasure.\""
   },
    {
      "Name": "Duchy",
      "Cost": "5",
      "Type": [
         "Victory"
      ],
      "Expansion": "Base",
      "FAQ": ""
   },
    {
      "Name": "Estate",
      "Cost": "2",
      "Type": [
         "Victory"
      ],
      "Expansion": "Base",
      "FAQ": ""
   },
    {
      "Name": "Festival",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You get +2 Actions, +1 Buy, and +^COIN2^."
   },
    {
      "Name": "Gardens",
      "Cost": "4",
      "Type": [
         "Victory"
      ],
      "Expansion": "Base",
      "FAQ": "- For example, if you have 37 cards at the end of the game, each copy of Gardens you have is worth 3^VP^.<br>- Use 8 copies of Gardens in a 2-player game, 12 copies for 3 or more players.<br>- Gardens counts all the cards belonging to you, including cards you have in play, cards that you have set aside, and cards on your mats, in addition to those physically in your deck at the end of the game."
   },
    {
      "Name": "Gold",
      "Cost": "6",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Base",
      "FAQ": ""
   },
    {
      "Name": "Laboratory",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You draw 2 cards and get +1 Action."
   },
    {
      "Name": "Library",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You look at cards one at a time, putting each one into your hand or setting it aside, until you have 7 cards in hand; then you discard the set aside cards.<br>- If you shuffle in the middle of doing this, you do not shuffle in the set aside cards.<br>- Only Action cards can be set aside. You are not forced to set aside Action cards; that is just an option.<br>- If you already have 7 cards in hand to start, you do not draw any cards.<br>- If you have 6 or fewer cards in hand and your -1 Card token is on your deck, you'll remove the token and will draw until you have 7 cards.<br>- If you set aside any Action-Reactions that care about being discarded (such as Village Green or Trail), you resolve their Reactions after you finish drawing."
   },
    {
      "Name": "Market",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You draw a card and get +1 Action, +^COIN1^, and +1 Buy."
   },
    {
      "Name": "Militia",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Base",
      "FAQ": "- Players with 3 or fewer cards in hand do not discard any cards. Players with more cards discard until they only have 3.<br>- When attacked by Militia, you do not have to let players see all the cards you discard, just the one you leave on top of your discard pile."
   },
    {
      "Name": "Mine",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You can, for example, trash a Copper to gain a Silver, or trash a Silver to gain a Gold.<br>- The Treasure you gain comes from the Supply and is put into your hand; you can play it for the same turn.<br>- If you do not have a Treasure to trash, you do not gain one.<br>- The Treasure you gain does not need to cost exactly ^COIN3^ more than the trashed Treasure; it can cost that much or less, and can even be another copy of the trashed Treasure."
   },
    {
      "Name": "Moat",
      "Cost": "2",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Base",
      "FAQ": "- An Attack card says \"Attack\" on the bottom line; in this set, Bandit, Bureaucrat, Militia, and Witch are Attacks.<br>- When another player plays an Attack card, you may reveal a Moat from your hand, before the Attack does anything, to be unaffected by the Attack - you do not reveal cards to Bandit, or put a Victory card on your deck for Bureaucrat, or discard for Militia, or gain a Curse for Witch.<br>- Moat stays in your hand, and can still be played on your next turn.<br>- Moat does not stop anything an Attack does to other players, or for the player who played it; it just protects you personally.<br>- Moat can also be played on your turn for +2 Cards.<br>- If multiple Attacks are played on a turn or in a round of turns, you may reveal Moat for as many of them as you want.<br>- Moat only gives you +2 Cards when you play it, not when you reveal it to use its Reaction ability.<br>- The other player must play the Attack card; for example, you cannot reveal Moat when another player buys a Noble Brigand.<br>- The played card must have the Attack type; for example, you cannot reveal Moat when another player plays a Masquerade.<br>- Other players must reveal Moat before you resolve any abilities of the Attack you played. For example, you can see if anyone reveals a Moat before making your choice with Minion, and before deciding whether to play your Attack via a Way."
   },
    {
      "Name": "Moneylender",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You only get the +^COIN3^ if you actually trashed a Copper."
   },
    {
      "Name": "Province",
      "Cost": "8",
      "Type": [
         "Victory"
      ],
      "Expansion": "Base",
      "FAQ": ""
   },
    {
      "Name": "Remodel",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You cannot trash the Remodel itself, since it is not in your hand after you play it.<br>- If you do not have a card to trash, you do not gain one.<br>- If you do gain a card, it comes from the Supply and is put into your discard pile.<br>- The gained card does not need to cost exactly ^COIN2^ more than the trashed card; it can cost that much or less, and can even be another copy of the trashed card.<br>- You cannot use ^COIN^ to increase how expensive of a card you gain.<br>- You must trash a card from your hand if you have one."
   },
    {
      "Name": "Silver",
      "Cost": "3",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Base",
      "FAQ": ""
   },
    {
      "Name": "Smithy",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You draw 3 cards."
   },
    {
      "Name": "Throne Room",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- Playing an Action card from your hand is optional. If you do play one, you resolve it completely, then play it a second time.<br>- You cannot play other cards in-between (unless told to by the card, such as with Vassal or Throne Room itself).<br>- Playing Action cards with Throne Room is just like playing Action cards normally, except it does not use up Action plays for the turn. For example if you start a turn by playing Throne Room on Village, you would draw a card, get +2 Actions, draw another card, and get +2 Actions again, leaving you with 4 Actions.<br>- If you Throne Room a Throne Room, you may play an Action card twice, then may play another Action card twice; you do not play one Action card four times.<br>- If you use Throne Room to play a card that removes itself from the play area, such as Horse from the Menagerie expansion, Throne Room will still play the card a second time. It will not return to the play area, due to the stop-moving rule; but the card's abilities still take effect as usual. This is a general rule that applies to all \"Throne Room variants\" that play the same card multiple times on a turn.<br>&nbsp;&nbsp;&nbsp;&nbsp;- However, if the card is worded in such a way that some of its abilities are contingent on the card leaving the play area, such as Mining Village or Madman, those abilities do not get activated a second time; the card has already moved to wherever it's going, so it can't go there again the second time to reactivate the effect.<br>- If you use Throne Room to play a Duration card, the Throne Room also stays in play until you discard the Duration card. This enables you to track the fact that the Duration card was played multiple times. Even if only one play of the Duration card is keeping it in play, such as using Throne Room on Gear and only setting aside cards one of the times, Throne Room stays in play with it. If the Duration card leaves play without being discarded (e.g. because you played it with Way of the Horse on one of its plays), Throne Room is discarded the turn the Duration card leaves play, even if the Duration card has not finished doing things.<br>- Throne Room plays a card twice; it does not double the effects of a card. It is possible that the card played by Throne Room does different things each time it's played."
   },
    {
      "Name": "Village",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- You draw a card and get +2 Actions.<br>- \"+2 Actions\" increases the number of Action cards you can play this turn; you do not have to play other Action cards right away, and playing them is not part of playing Village."
   },
    {
      "Name": "Witch",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Base",
      "FAQ": "- The Curses come from the Supply and are put into discard piles.<br>- They are given out in turn order, which can matter when the Curse pile is low.<br>- When the Curses are gone, you can still play Witch for +2 Cards."
   },
    {
      "Name": "Workshop",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Base",
      "FAQ": "- The card you gain comes from the Supply and is put into your discard pile.<br>- You cannot use ^COIN^ to increase how expensive of a card you gain; it always costs from ^COIN0^ to ^COIN4^.<br>- Workshop cares about the costs cards have when you play the Workshop, which can sometimes be different than the cost printed on the card. For example, if you play Highway the cost of Duchy is reduced to ^COIN4^, and so now you can use Workshop to gain a Duchy."
   },
    {
      "Name": "Adventurer",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 1E",
      "FAQ": "- If you have to shuffle in the middle, shuffle. Don't shuffle in the revealed cards as these cards do not go to the Discard pile until you have finished revealing cards.<br>- If you run out of cards after shuffling and still only have one Treasure, you get just that one Treasure."
   },
    {
      "Name": "Chancellor",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 1E",
      "FAQ": "- You must resolve the Chancellor (decide whether or not to discard your Deck by flipping it into your Discard pile) before doing other things on your turn, like deciding what to buy or playing another Action card.<br>- You may not look through your Deck as you discard it.<br>- Putting your Deck in your Discard pile in this manner does not count as individually discarding each card in your deck, and you may not use Reactions that require discarding a card (such as that of Tunnels) as you put those cards in your discard pile with Chancellor."
   },
    {
      "Name": "Feast",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 1E",
      "FAQ": "- The gained card goes into your Discard pile.<br>- It has to be a card from the Supply.<br>- You cannot use ^COIN^ from Treasures or previous Actions (like the Market) to increase the cost of the card that you gain.<br>- If you use Throne Room on Feast, you will gain two cards, even though you can only trash Feast once. Gaining the card isn't contingent on trashing Feast; they're just two things that the card tries to make you do."
   },
    {
      "Name": "Spy",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Base, 1E",
      "FAQ": "- Spy causes all players, including the one who played it, to reveal the top card of their Deck.<br>- Note that you draw your card for playing Spy before any cards are revealed.<br>- Anyone who does not have any cards left in their Deck shuffles in order to have something to reveal. Anyone who still has no cards to reveal doesn't reveal one.<br>- If players care about the order in which things happen for this, you do yourself first, then each other player in turn order.<br>- Revealed cards that aren't discarded are returned to the top of their players' Decks.<br>- In a strict interpretation of the rules, each player reveals their card and returns it or discards it before the next player does, and for certain cards (such as Chariot Race), this can matter when it comes to deciding which each player should do. However, in practice, it's usually fine for all players to reveal their cards at the same time for efficiency's sake, provided there's no effect in the game that cares about the order of revealing."
   },
    {
      "Name": "Thief",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Base, 1E",
      "FAQ": "- A player with just one card left reveals that last card and then shuffles to get the other card to reveal (without including the revealed card); a player with no cards left shuffles to get both of them.<br>- A player who still doesn't have two cards to reveal after shuffling just reveals what they can.<br>- Each player trashes one Treasure card at most, of the attacker's choice from the two revealed cards, and then you gain any of the trashed cards that you want.<br>- You can only take Treasures just trashed—not ones trashed on previous turns. You can take none of them, all of them, or anything in between.<br>- Put the Treasures you decided to gain into your Discard pile. The ones you choose not to gain stay in the Trash pile.<br>- The treasures are trashed and then gained, so any things that happen on-trash happen first, and then any on-gain abilities activate afterwards."
   },
    {
      "Name": "Woodcutter",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 1E",
      "FAQ": "- During your Buy phase, you add ^COIN2^ to the total value of the Treasure cards played, and you may buy an additional card from the Supply."
   },
    {
      "Name": "Artisan",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 2E",
      "FAQ": "- The card you gain comes from the Supply and is put into your hand.<br>- You cannot use ^COIN^ to increase how expensive a card you gain; it always costs from ^COIN0^ to ^COIN5^.<br>- After gaining the card, you put a card from your hand onto your deck; that can be the card you just gained, or a different card.<br>- Artisan cares about the costs cards have when you play the Artisan. For example, if you play Highway and then Artisan, you can gain a Gold since it now costs ^COIN5^."
   },
    {
      "Name": "Bandit",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Base, 2E",
      "FAQ": "- First you gain a Gold from the Supply, putting it into your discard pile.<br>- Then each other player, in turn order, reveals their top 2 cards, trashes one they choose that is a Treasure other than Copper (e.g. Silver or Gold), and discards the other revealed cards. A player who did not reveal a Treasure card other than Copper simply discards both cards."
   },
    {
      "Name": "Harbinger",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 2E",
      "FAQ": "- First draw a card and get +1 Action; then look through your discard pile, and you may put a card from it on top of your deck.<br>- Putting a card on top is optional."
   },
    {
      "Name": "Merchant",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 2E",
      "FAQ": "- When you play Merchant, you draw a card and get +1 Action.<br>- If you end up playing a Silver later in the turn, it comes with +^COIN1^.<br>- If you play more than one Merchant, each gives you +^COIN1^ when you play that first Silver; but if you play more than one Silver, you only get the +^COIN1^ for the first Silver.<br>- If you play the same Merchant multiple times (e.g. with Throne Room), each of the plays will give you +^COIN1^ when you play the first Silver.<br>- If you play Merchant after you play your first Silver (e.g. you played a Silver to buy a Villa, and then play a Merchant), you do not get +^COIN1^ for the Silver you already played; you also do not get +^COIN1^ if you play another Silver since it's not the first one you played.<br>- However, if playing a Silver causes you to play a Merchant (e.g. you trash a Catacombs with Sauna, gain a Merchant, and play it with Innovation), you'll get +^COIN1^."
   },
    {
      "Name": "Poacher",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 2E",
      "FAQ": "- You draw your one card before discarding.<br>- If there are no empty piles, you do not discard. If there is one empty pile, you discard one card; if there are two empty piles, you discard two cards, and so on. This includes all Supply piles, including Curses, Coppers, Poacher itself, etc.<br>- If you do not have enough cards to discard, just discard the rest of your hand.<br>- Non-Supply piles, such as Spoils, do not matter to Poacher."
   },
    {
      "Name": "Sentry",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 2E",
      "FAQ": "- First you draw a card and get +1 Action.<br>- Then you look at the top 2 cards of your deck. You can trash both, or discard both, or put both back in either order; or you can trash one and discard one, or trash one and put one back, or discard one and put one back.<br>- You finish trashing any cards you choose to before you decide whether to discard any of the remaining cards."
   },
    {
      "Name": "Vassal",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Base, 2E",
      "FAQ": "- If the card is an Action card, you can play it, but do not have to.<br>- If you do play it, you move it into your play area and follow its instructions; this does not use up one of your Action plays for the turn.<br>- Previously, if you discarded an Action that moves itself when it is discarded, such as Faithful Hound or Village Green, you could still opt to play the Action card but wouldn't be able to move it into play. However, playing the Action is no longer possible under a new rule for playing cards."
   },
    {
      "Name": "Fairgrounds",
      "Cost": "6",
      "Type": [
         "Victory"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Hamlet",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Horn of Plenty",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Hunting Party",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Jester",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Menagerie",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Remake",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Young Witch",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Cornucopia",
      "FAQ": "..."
   },
    {
      "Name": "Carnival",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Coronet",
      "Cost": "0",
      "Type": [
         "Action",
         "Treasure",
         "Reward"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Courser",
      "Cost": "0",
      "Type": [
         "Action",
         "Reward"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Demesne",
      "Cost": "0",
      "Type": [
         "Action",
         "Victory",
         "Reward"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Farmhands",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Farrier",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Ferryman",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Footpad",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Housecarl",
      "Cost": "0",
      "Type": [
         "Action",
         "Reward"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Huge Turnip",
      "Cost": "0",
      "Type": [
         "Treasure",
         "Reward"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Infirmary",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Joust",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Renown",
      "Cost": "0",
      "Type": [
         "Action",
         "Reward"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Shop",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia & Guilds, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Bag of Gold",
      "Cost": "0",
      "Type": [
         "Action",
         "Prize"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Diadem",
      "Cost": "0",
      "Type": [
         "Treasure",
         "Prize"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Farming Village",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Followers",
      "Cost": "0",
      "Type": [
         "Action",
         "Attack",
         "Prize"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Fortune Teller",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Harvest",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Horse Traders",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Princess",
      "Cost": "0",
      "Type": [
         "Action",
         "Prize"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Tournament",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Trusty Steed",
      "Cost": "0",
      "Type": [
         "Action",
         "Prize"
      ],
      "Expansion": "Cornucopia, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Abandoned Mine",
      "Cost": "0",
      "Type": [
         "Action",
         "Ruins"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Altar",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Armory",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Band of Misfits",
      "Cost": "5",
      "Type": [
         "Action",
         "Command"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Bandit Camp",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Beggar",
      "Cost": "2",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Catacombs",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Count",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Counterfeit",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Cultist",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Looter"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Dame Anna",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Dame Josephine",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Victory",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Dame Molly",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Dame Natalie",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Dame Sylvia",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Death Cart",
      "Cost": "4",
      "Type": [
         "Action",
         "Looter"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Feodum",
      "Cost": "4",
      "Type": [
         "Victory"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Forager",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Fortress",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Graverobber",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Hermit",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Hovel",
      "Cost": "1",
      "Type": [
         "Reaction",
         "Shelter"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Hunting Grounds",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Ironmonger",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Junk Dealer",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Madman",
      "Cost": "0",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Marauder",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack",
         "Looter"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Market Square",
      "Cost": "3",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Mercenary",
      "Cost": "0",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Mystic",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Necropolis",
      "Cost": "1",
      "Type": [
         "Action",
         "Shelter"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Overgrown Estate",
      "Cost": "1",
      "Type": [
         "Victory",
         "Shelter"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Pillage",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Poor House",
      "Cost": "1",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Procession",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Rats",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Rebuild",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Rogue",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Ruined Library",
      "Cost": "0",
      "Type": [
         "Action",
         "Ruins"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Ruined Market",
      "Cost": "0",
      "Type": [
         "Action",
         "Ruins"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Ruined Village",
      "Cost": "0",
      "Type": [
         "Action",
         "Ruins"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Sage",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Scavenger",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Sir Bailey",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Sir Destry",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Sir Martin",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Sir Michael",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Sir Vander",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Knight"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Spoils",
      "Cost": "0",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Squire",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Storeroom",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Survivors",
      "Cost": "0",
      "Type": [
         "Action",
         "Ruins"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Urchin",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Vagrant",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Wandering Minstrel",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Dark Ages",
      "FAQ": "..."
   },
    {
      "Name": "Advance",
      "Cost": "0",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Annex",
      "Cost": "D8",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Aqueduct",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Archive",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Arena",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Bandit Fort",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Banquet",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Basilica",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Baths",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Battlefield",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Bustling Village",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Capital",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Catapult",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Chariot Race",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Charm",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "City Quarter",
      "Cost": "d8",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Colonnade",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Conquest",
      "Cost": "6",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Crown",
      "Cost": "5",
      "Type": [
         "Action",
         "Treasure"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Crumbling Castle",
      "Cost": "4",
      "Type": [
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Defiled Shrine",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Delve",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Dominate",
      "Cost": "14",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Donate",
      "Cost": "d8",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Emporium",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Encampment",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Enchantress",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack",
         "Duration"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Engineer",
      "Cost": "d4",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Farmers' Market",
      "Cost": "3",
      "Type": [
         "Action",
         "Gathering"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Fortune",
      "Cost": "8d8",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Forum",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Fountain",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Gladiator",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Grand Castle",
      "Cost": "9",
      "Type": [
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Groundskeeper",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Haunted Castle",
      "Cost": "6",
      "Type": [
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Humble Castle",
      "Cost": "3",
      "Type": [
         "Treasure",
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Keep",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "King's Castle",
      "Cost": "10",
      "Type": [
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Labyrinth",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Legionary",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Mountain Pass",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Museum",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Obelisk",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Opulent Castle",
      "Cost": "7",
      "Type": [
         "Action",
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Orchard",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Overlord",
      "Cost": "d8",
      "Type": [
         "Action",
         "Command"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Palace",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Patrician",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Plunder",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Ritual",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Rocks",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Royal Blacksmith",
      "Cost": "d8",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Sacrifice",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Salt the Earth",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Settlers",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Small Castle",
      "Cost": "5",
      "Type": [
         "Action",
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Sprawling Castle",
      "Cost": "8",
      "Type": [
         "Victory",
         "Castle"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Tax",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Temple",
      "Cost": "4",
      "Type": [
         "Action",
         "Gathering"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Tomb",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Tower",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Triumph",
      "Cost": "d5",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Triumphal Arch",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Villa",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Wall",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Wedding",
      "Cost": "4d3",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Wild Hunt",
      "Cost": "5",
      "Type": [
         "Action",
         "Gathering"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Windfall",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Wolf Den",
      "Type": [
         "Landmark"
      ],
      "Expansion": "Empires",
      "FAQ": "..."
   },
    {
      "Name": "Advisor",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Baker",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Butcher",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Candlestick Maker",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Herald",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Journeyman",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Merchant Guild",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Plaza",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Soothsayer",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Stonemason",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds",
      "FAQ": "..."
   },
    {
      "Name": "Doctor",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Guilds, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Masterpiece",
      "Cost": "3",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Guilds, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Taxman",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Guilds, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Border Village",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Cartographer",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Crossroads",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Develop",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Farmland",
      "Cost": "6",
      "Type": [
         "Victory"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Fool's Gold",
      "Cost": "2",
      "Type": [
         "Treasure",
         "Reaction"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Haggler",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Highway",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Inn",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Jack of All Trades",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Margrave",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Oasis",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Scheme",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Spice Merchant",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Stables",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Trader",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Tunnel",
      "Cost": "3",
      "Type": [
         "Victory",
         "Reaction"
      ],
      "Expansion": "Hinterlands",
      "FAQ": "..."
   },
    {
      "Name": "Cache",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Duchess",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Embassy",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Ill-Gotten Gains",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Mandarin",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Noble Brigand",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Nomad Camp",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Oracle",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Silk Road",
      "Cost": "4",
      "Type": [
         "Victory"
      ],
      "Expansion": "Hinterlands, 1E",
      "FAQ": "..."
   },
    {
      "Name": "Berserker",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Cauldron",
      "Cost": "5",
      "Type": [
         "Treasure",
         "Attack"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Guard Dog",
      "Cost": "3",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Nomads",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Souk",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Trail",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Weaver",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Wheelwright",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Witch's Hut",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Hinterlands, 2E",
      "FAQ": "..."
   },
    {
      "Name": "Baron",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- You do not have to discard an Estate, but if you do not, you must gain an Estate (if any are left)."
   },
    {
      "Name": "Bridge",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- All cards, including cards in the Supply, in play, in decks, and in hands, cost ^COIN1^ less for the rest of this turn, but not less than ^COIN0^.<br>- For example after playing Bridge, you could buy a Gold with ^COIN5^, since Gold only costs ^COIN5^; you could Upgrade Copper to Estate, since Copper still costs ^COIN0^, but Estate costs ^COIN1^; you could use Ironworks to gain a Duchy, since Duchy only costs ^COIN4^.<br>- This is cumulative; if you play two Bridges (or the same Bridge twice via Throne Room), cards will cost ^COIN2^ less.<br>- The effect of Bridge does not depend on the Bridge card itself being in play—only on how many times you've played it this turn. Thus if you use Procession on a Bridge, costs are still reduced (by ^COIN2^) even though the Bridge ends up in the trash."
   },
    {
      "Name": "Conspirator",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- This counts Actions played this turn, rather than Action cards in play.<br>- For example if you start a turn with Throne Room on a Conspirator, you get +^COIN2^ for the first play of Conspirator, but +^COIN2^ +1 Card +1 Action for the second play of Conspirator. You only have two Action cards in play, but the second play of Conspirator is your third Action played this turn.<br>- Conspirator does count one-shots and other Actions that have been played but left the play area, but does not count Durations that are still in play left over from the previous turn, or Reserves called into play that were not played this turn.<br>- When you play a Command variant, you are playing two actions. The Command variant is the first action, and the card it plays is the second action."
   },
    {
      "Name": "Courtyard",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "-The card you put on top does not have to be one of the 3 you just drew."
   },
    {
      "Name": "Duke",
      "Cost": "5",
      "Type": [
         "Victory"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- For example, if you have five Duchies, then each of your Dukes is worth 5^VP^.<br>- Use 8 Dukes for games with 2 players, 12 for games with 3 or more players."
   },
    {
      "Name": "Harem",
      "Cost": "6",
      "Type": [
         "Treasure",
         "Victory"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- This can be played in your Buy phase like other Treasures, and is worth 2^VP^ at the end of the game.<br>- Use 8 Harems/Farms for games with 2 players, 12 for games with 3 or more players."
   },
    {
      "Name": "Ironworks",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- The card you gain comes from the Supply and is put into your discard pile.<br>- You get bonuses depending on the types of the card you gained.<br>- A card with 2 types gives you both bonuses; if you use Ironworks to gain a Mill, you both draw a card and get +1 Action.<br>- If you gain a card that has none of the listed types (such as Curse or Ghost Town), you get no bonus.<br>- If you gain an Estate after buying Inheritance, you get +1 Action and +1 Card.<br>- Abilities that happen when you gain a card happen before you get the bonuses from Ironworks. For example, if you gain a Mill and play it with Innovation, you'll get +1 Action and +1 Card after you finish playing the Mill.<br>- During a Possession turn, Ironworks will never give you any bonus (see the blue dog rule)."
   },
    {
      "Name": "Masquerade",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- First you draw 2 cards.<br>- Then, all players at the same time choose a card to pass left, putting it face down on the table between players.<br>- Then the cards are passed; each player takes the passed card from the player to their right.<br>- Players with no cards in hand (such as due to Torturer) are skipped over - they neither pass a card nor receive one.<br>- Finally, you may trash a card from your hand.<br>- This is not an Attack and so cannot be stopped with Moat.<br>- Passed cards are not \"gained\" (which matters for some expansion cards, e.g. Trader from Dominion: Hinterlands).<br>- If only one player has cards in their hand, they pass a card to themself.<br>- Masquerade's mechanism for changing card ownership is unique in the game, since it uses the word \"pass\" to indicate a change of card ownership. The consequence of this wording is that the player receiving a passed card is not \"gaining\" it. So, for example, they cannot react to the card passing with Watchtower."
   },
    {
      "Name": "Mining Village",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- First draw a card and get +2 Actions; then choose whether or not to trash Mining Village before moving on to other actions or other phases, getting +^COIN2^ if you did.<br>- You may not trash Mining Village later in the turn, only right then.<br>- If you Throne Room a Mining Village, you cannot trash it twice (and so cannot get the +^COIN2^ twice)."
   },
    {
      "Name": "Minion",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- Players wishing to respond with e.g. Moat or Diplomat do so before you choose your option.<br>- A player who Moats this neither discards nor draws.<br>- You still draw 4 cards if you choose the discard option with no cards left in hand.<br>- Horse Traders normally doesn't actually block an attack, but in the case of Minion it can."
   },
    {
      "Name": "Nobles",
      "Cost": "6",
      "Type": [
         "Action",
         "Victory"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- Use 8 copies of Nobles for games with 2 players, 12 for games with 3 or more players.<br>- If you play the same Nobles multiple times, such as with Throne Room, Procession, or King's Court, you may make different choices for each play."
   },
    {
      "Name": "Pawn",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- You pick both things before doing either.<br>- You cannot pick the same option twice.<br>- If Pawn is Throne Roomed or King's Courted, the choices do not have to be the same for each play of Pawn."
   },
    {
      "Name": "Shanty Town",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- You get +2 Actions, then reveal your hand.<br>- If it has no Action cards in it (including Action cards with other types too, such as Nobles), then you draw 2 cards.<br>- If you Throne Room a Shanty Town, you reveal your hand, get +2 actions, and potentially draw two cards, then you reveal your hand again, get 2 more actions, and potentially draw two more cards. You do NOT reveal your hand once and get +4 cards."
   },
    {
      "Name": "Steward",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- First choose one of the three options, then do it.<br>- If you pick \"trash 2 cards from your hand\" and only have one card in hand, you trash that card; if you choose that option and have 2 or more cards in hand, you have to trash 2.<br>- You first choose which two cards to trash, then trash them both at the same time, and then choose which order to activate any when-trashed effects."
   },
    {
      "Name": "Swindler",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- When it matters (such as when piles are low), go in turn order, starting with the player to your left.<br>- Each other player trashes their top card, and gains a replacement you choose with the same cost.<br>- The card they gain comes from the Supply and goes to their discard pile.<br>- For example if a player trashed Copper, you might give them Curse, which costs ^COIN0^ like Copper does.<br>- You can give a player back another copy of what they lost.<br>- If the Supply has no cards with the same cost as the trashed card, the player fails to gain a card.<br>- When-trashed effects trigger before the player who played Swindler has to choose which card the opponent gains. The opponent is the one who trashes the revealed card and resolves any when-trashed effects."
   },
    {
      "Name": "Torturer",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- If it matters, the other players choose what happens to them (and resolve that) in turn order, starting to your left.<br>- A player can choose to gain a Curse even with no Curses left (and thus not gain one), or to discard 2 cards even with one or zero cards in hand (discarding their only card if they have one).<br>- Gained Curses go to players' hands rather than their discard piles."
   },
    {
      "Name": "Trading Post",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- If you have only one card in hand, trash it and nothing else happens; if you have 2 or more cards in hand, trash exactly 2 of them and gain a Silver, putting it into your hand."
   },
    {
      "Name": "Upgrade",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- First draw a card and get +1 Action; then trash a card from your hand; then gain a card costing exactly ^COIN1^ more than the trashed card.<br>- The gained card comes from the Supply and is put into your discard pile.<br>- If there is no card available at that cost, you do not gain a card; for example if you play Upgrade and trash a Copper, in a game with nothing costing ^COIN1^, you simply fail to gain a card.<br>- First you trash a card, and resolve all of its on-trash effects; then you gain a card, and then resolve all on-gain effects."
   },
    {
      "Name": "Wishing Well",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue",
      "FAQ": "- First you draw a card and get +1 Action.<br>- Then name a card - a name, not a type, so e.g. \"Copper,\" not \"Treasure.\"<br>- Reveal the top card of your deck. If it has the name you named, put it into your hand, otherwise leave it on your deck."
   },
    {
      "Name": "Coppersmith",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue, 1E",
      "FAQ": "- This just changes how much money you get when playing Copper.<br>- The effect is cumulative; if you use Throne Room on Coppersmith, each Copper that you play that turn will produce ^COIN3^.<br>- The bonus value does not apply retroactively to Coppers in play before playing the Coppersmith (via Black Market or Storyteller)."
   },
    {
      "Name": "Great Hall",
      "Cost": "3",
      "Type": [
         "Action",
         "Victory"
      ],
      "Expansion": "Intrigue, 1E",
      "FAQ": "- This is both an Action card and a Victory card.<br>- When you play it, you draw a card and may play another Action.<br>- At the end of the game, it's worth 1^VP^, like an Estate.<br>- During set-up, place 12 Great Halls in the Supply for a 3- or 4-player game and 8 in the Supply for a 2-player game."
   },
    {
      "Name": "Saboteur",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Intrigue, 1E",
      "FAQ": "- Each other player turns over the top cards of their deck until they reveal one costing ^COIN3^ or more. If a player needs to shuffle to continue revealing cards, they do not shuffle in the already revealed cards.<br>- If a player goes through all of their cards without finding a card costing ^COIN3^ or more, they just discard everything revealed and are done.<br>- If they do find a card costing ^COIN3^ or more, they trash it, and then may choose to gain a card costing at most ^COIN2^ less than the trashed card. For example, if they trashed a card costing ^COIN5^, they may gain a card costing up to ^COIN3^.<br>- The gained card must be from the Supply and is put into their discard pile, as are their revealed cards.<br>- Costs of cards are affected by Bridge.<br>- Saboteur forces other players to trash their own card; the player who owns the card being trashed is the one who trashes it and gets any on-trash benefits."
   },
    {
      "Name": "Scout",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue, 1E",
      "FAQ": "- If there are fewer than 4 cards left in your deck, reveal all the cards in your deck, shuffle your discard pile (which does not include currently revealed cards), and then reveal the remainder needed.<br>- Action - Victory cards are Victory cards.<br>- Curse cards are not Victory cards.<br>- Take all revealed Victory cards into your hand; you cannot choose to leave some on top.<br>- You do not have to reveal the order that you put cards back in."
   },
    {
      "Name": "Secret Chamber",
      "Cost": "2",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Intrigue, 1E",
      "FAQ": "- When you play this as an Action on your turn, you first discard any number of cards from your hand, then get ^COIN1^ per card you discarded. The other ability does nothing at that time as it is only used as a Reaction.<br>- You may choose to discard zero cards, but then you will get zero additional ^COIN^.<br>- When someone else plays an Attack card, you may reveal Secret Chamber from your hand. If you do, first you draw 2 cards, then you put any 2 cards from your hand on top of your deck (in any order).<br>- The cards you put back do not have to be the ones you drew. You can put Secret Chamber itself on top of your deck; it's still in your hand when you reveal it.<br>- Revealing Secret Chamber happens prior to resolving what an Attack does to you. For example, if another player plays Thief, you can reveal Secret Chamber, draw 2 cards, put 2 back, and then you resolve getting hit by the Thief.<br>- You can reveal Secret Chamber whenever another player plays an Attack card, even if that Attack would not affect you.<br>- Also, you can reveal more than one Reaction card in response to an Attack. For example, after revealing the Secret Chamber in response to an Attack and resolving the effect of the Secret Chamber, you can still reveal a Moat to avoid the Attack completely.<br>- You may reveal the same Secret Chamber multiple times when reacting to an Attack; for example, in response to an attack, you could reveal Secret Chamber, draw a Moat and a Copper off the top of your deck, put back two coppers, reveal the Moat to be unaffected by the attack, and then reveal Secret Chamber again to put either the Moat or the Secret Chamber back on top of your deck.<br>- Revealing the Secret Chamber alone does NOT prevent the attack from affecting you. You can reveal Secret Chamber even in response to an attack that does not affect the top of your deck, like Witch.<br>- You must reveal the Secret Chamber as soon as the Attack is played, but before any text on it is resolved. So if your opponent plays Minion or Pirate Ship, you must finish drawing cards and then putting cards back on top before your opponent makes their"
   },
    {
      "Name": "Tribute",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue, 1E",
      "FAQ": "- If the player after you has fewer than 2 cards left in his deck, he reveals all the cards in his deck, shuffles his discard pile (which does not include currently revealed cards), and then reveals the remainder needed. The player then discards the revealed cards.<br>- If the player after you does not have enough cards to reveal 2, he reveals what he can.<br>- You get bonuses for the types of cards revealed, counting only the different cards.<br>- A card with 2 types gives you both bonuses.<br>- So if the player to your left reveals Copper and Harem, you get +^COIN4^ and +2 cards; if he reveals 2 Silvers, you just get +^COIN2^.<br>- Curse produces no bonus."
   },
    {
      "Name": "Courtier",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue, 2E",
      "FAQ": "- First reveal a card from your hand, then count the types.<br>- The types are the words on the bottom line - including Action, Attack, Curse, Reaction, Treasure, and Victory (with more in expansions).<br>- Then choose one different thing per type the card had; if you revealed a card with two types, you pick two things.<br>- For example you could reveal a Copper and choose \"gain a Gold,\" or reveal a Mill and choose \"+1 Action\" and \"+^COIN3^.\"<br>- If you gain a Gold, put the Gold into your discard pile.<br>- If you play Courtier twice, you may reveal either the same card or a different card the second time, and choose the same bonuses or different ones.<br>- Revealing a card with four types (such as Werewolf or Dame Josephine) gives you all 4 bonuses.<br>- Capitalism, Inheritance, and Charlatan can change the number of types a card has, and Courtier takes that into account when counting types.<br>- If you reveal a card with 5 types (such as a Stronghold affected by Capitalism), you get the 4 bonuses and nothing extra.<br>- If you use Elder on Courtier, you get one extra choice, not one extra choice per type. So if you reveal a card with 2 types, you get 3 choices from Courtier.<br>- If you can't reveal a card (because you have no cards in hand), you get no bonus. This is true even if you play this with Elder."
   },
    {
      "Name": "Diplomat",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Intrigue, 2E",
      "FAQ": "- When playing this, you get +2 Cards, then count your cards in hand, and if you have 5 cards or fewer, you get +2 Actions.<br>&nbsp;&nbsp;- So, for example if you play this from a hand of 5 cards, you will put it into play, going down to 4 cards, then draw 2 cards, going up to 6 cards, and that is more than 5 cards so you would not get the +2 Actions.<br>- Diplomat can also be used when another player plays an Attack card, if you have at least 5 cards in hand.<br>&nbsp;&nbsp;- Before the Attack card does anything, you can reveal a Diplomat from your hand; if you do, you draw 2 cards, then discard 3 cards (which can include the Diplomat).<br>&nbsp;&nbsp;- If you still have at least 5 cards in hand after doing that (such as due to Council Rooms), you can reveal Diplomat again and do it again.<br>&nbsp;&nbsp;- You reveal Reactions one at a time; you cannot reveal two Diplomats simultaneously.<br>&nbsp;&nbsp;- You can reveal a Moat from your hand (to be unaffected by an Attack) either before or after revealing and resolving a Diplomat (even if the Moat was not in your hand until after resolving Diplomat)."
   },
    {
      "Name": "Lurker",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue, 2E",
      "FAQ": "- The card trashed or gained has to be an Action card, but can have other types too. For example, Lurker can trash Nobles from the Supply and can gain Nobles from the trash.<br>- When gaining a card with Lurker, put the gained card into your discard pile.<br>- Trashing a card from the Supply will activate its when-trash abilities. For example, if you trash a Fortress from the Supply, it will move itself into your hand; if you trash Hunting Grounds from the Supply, you gain a Duchy or 3 Estates.<br>- Trashing from the Supply does not allow you to react with Market Square, because it isn't one of your cards.<br>- You can choose the gain-from-trash option even if there are no Actions in the trash at the time; in that case, nothing happens. (Similarly, you can also choose the trash-from-Supply option even in the unlikely event that there are no Actions in the Supply.)<br>- You can only trash the top card of a Supply pile, which may matter with split piles or Knights."
   },
    {
      "Name": "Mill",
      "Cost": "4",
      "Type": [
         "Action",
         "Victory"
      ],
      "Expansion": "Intrigue, 2E",
      "FAQ": "- You can choose to discard 2 cards even if you only have one card in hand, but you only get +^COIN2^ if you actually discarded 2 cards.<br>- Use 8 Mills for games with 2 players, 12 for games with 3 or more players."
   },
    {
      "Name": "Patrol",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue, 2E",
      "FAQ": "- First draw 3 cards, then reveal the top 4 cards of your deck.<br>- Put the revealed Victory cards and Curses into your hand; you have to take them all.<br>- Put the rest of the cards back on your deck in any order you choose."
   },
    {
      "Name": "Replace",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Intrigue, 2E",
      "FAQ": "- Like Remodel, you first trash a card from your hand, then gain a card from the Supply costing up to ^COIN2^ more than the trashed card, putting the gained card into your discard pile.<br>- Replace gives you an additional bonus based on the types of the gained card; if it is an Action or Treasure you move it to the top of your deck, and if it is a Victory card the other players each gain a Curse.<br>- It is possible to get both bonuses; if you gain Harem, Mill, or Nobles with Replace, it both goes on your deck and causes the other players to each gain a Curse.<br>- Replace is not subject to the no-visiting rule. If you gain an Action or Treasure with Replace, it is first gained to your discard pile (or whatever its default gain location is), and then it is moved to the top of your deck if possible. If an on-gain effect causes it to be moved elsewhere first, Replace will fail to topdeck it. So for example, if you gain an Action card and then use Innovation on it, Replace cannot remove the card from your play area and put it onto your deck.<br>&nbsp;&nbsp;- If you do this with an Action-Victory card (like Nobles), that does not stop Replace from giving out Curses.<br>&nbsp;&nbsp;- Replace will also fail to move a card if it moves away, and then moves back to the same place. For example, if you gain an Experiment, exile it to Gatekeeper, then gain the second Experiment and discard the first Experiment from Exile, Replace will still fail to topdeck the Experiment, even though it's still in your discard pile."
   },
    {
      "Name": "Secret Passage",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Intrigue, 2E",
      "FAQ": "- First draw 2 cards and get +1 Action; then put a card from your hand anywhere in your deck.<br>- The card can be one you just drew or any other card from your hand.<br>- It can go on top of your deck, on the bottom, or anywhere in-between; you can count out a specific place to put it, e.g. four cards down.<br>- If there are no cards left in your deck, the card put back becomes the only card in your deck.<br>- Where you put the card is public knowledge.<br>- You don't have to put the card into a specific spot, you can just shove it into your deck if you want."
   },
    {
      "Name": "Alliance",
      "Cost": "10",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Animal Fair",
      "Cost": "7",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Banish",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Bargain",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Barge",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Black Cat",
      "Cost": "2",
      "Type": [
         "Action",
         "Attack",
         "Reaction"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Bounty Hunter",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Camel Train",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Cardinal",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Cavalry",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Commerce",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Coven",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Delay",
      "Cost": "0",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Demand",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Desperation",
      "Cost": "0",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Destrier",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Displace",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Enclave",
      "Cost": "8",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Enhance",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Falconer",
      "Cost": "5",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Fisherman",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Gamble",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Gatekeeper",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Goatherd",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Groom",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Horse",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Hostelry",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Hunting Lodge",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Invest",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Kiln",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Livery",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "March",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Mastermind",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Paddock",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Populate",
      "Cost": "10",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Pursue",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Reap",
      "Cost": "7",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Ride",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Sanctuary",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Scrap",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Seize the Day",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Sheepdog",
      "Cost": "3",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Sleigh",
      "Cost": "2",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Snowy Village",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Stampede",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Stockpile",
      "Cost": "3",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Supplies",
      "Cost": "2",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Toil",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Transport",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Village Green",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration",
         "Reaction"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Butterfly",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Camel",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Chameleon",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Frog",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Goat",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Horse",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Mole",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Monkey",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Mouse",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Mule",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Otter",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Owl",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Ox",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Pig",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Rat",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Seal",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Sheep",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Squirrel",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Turtle",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Way of the Worm",
      "Type": [
         "Way"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Wayfarer",
      "Cost": "$6",
      "Type": [
         "Action"
      ],
      "Expansion": "Menagerie",
      "FAQ": "..."
   },
    {
      "Name": "Bad Omens",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Bard",
      "Cost": "4",
      "Type": [
         "Action",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Bat",
      "Cost": "2",
      "Type": [
         "Night"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Blessed Village",
      "Cost": "4",
      "Type": [
         "Action",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Cemetery",
      "Cost": "4",
      "Type": [
         "Victory"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Changeling",
      "Cost": "3",
      "Type": [
         "Night"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Cobbler",
      "Cost": "5",
      "Type": [
         "Night",
         "Duration"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Conclave",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Crypt",
      "Cost": "5",
      "Type": [
         "Night",
         "Duration"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Cursed Gold",
      "Cost": "4",
      "Type": [
         "Treasure",
         "Heirloom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Cursed Village",
      "Cost": "5",
      "Type": [
         "Action",
         "Doom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Deluded",
      "Type": [
         "State"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Delusion",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Den of Sin",
      "Cost": "5",
      "Type": [
         "Night",
         "Duration"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Devil's Workshop",
      "Cost": "4",
      "Type": [
         "Night"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Druid",
      "Cost": "2",
      "Type": [
         "Action",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Envious",
      "Type": [
         "State"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Envy",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Exorcist",
      "Cost": "4",
      "Type": [
         "Night"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Faithful Hound",
      "Cost": "2",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Famine",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Fear",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Fool",
      "Cost": "3",
      "Type": [
         "Action",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Ghost",
      "Cost": "4",
      "Type": [
         "Night",
         "Duration",
         "Spirit"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Ghost Town",
      "Cost": "3",
      "Type": [
         "Night",
         "Duration"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Goat",
      "Cost": "2",
      "Type": [
         "Treasure",
         "Heirloom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Greed",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Guardian",
      "Cost": "2",
      "Type": [
         "Night",
         "Duration"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Haunted Mirror",
      "Cost": "0",
      "Type": [
         "Treasure",
         "Heirloom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Haunting",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Idol",
      "Cost": "5",
      "Type": [
         "Treasure",
         "Attack",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Imp",
      "Cost": "2",
      "Type": [
         "Action",
         "Spirit"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Leprechaun",
      "Cost": "3",
      "Type": [
         "Action",
         "Doom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Locusts",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Lost in the Woods",
      "Type": [
         "State"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Lucky Coin",
      "Cost": "4",
      "Type": [
         "Treasure",
         "Heirloom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Magic Lamp",
      "Cost": "0",
      "Type": [
         "Treasure",
         "Heirloom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Miserable",
      "Type": [
         "State"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Misery",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Monastery",
      "Cost": "2",
      "Type": [
         "Night"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Necromancer",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Night Watchman",
      "Cost": "3",
      "Type": [
         "Night"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Pasture",
      "Cost": "2",
      "Type": [
         "Treasure",
         "Victory",
         "Heirloom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Pixie",
      "Cost": "2",
      "Type": [
         "Action",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Plague",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Pooka",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Pouch",
      "Cost": "2",
      "Type": [
         "Treasure",
         "Heirloom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Poverty",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Raider",
      "Cost": "6",
      "Type": [
         "Night",
         "Duration",
         "Attack"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Sacred Grove",
      "Cost": "5",
      "Type": [
         "Action",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Secret Cave",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Shepherd",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Skulk",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack",
         "Doom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Earth's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Field's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Flame's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Forest's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Moon's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Mountain's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The River's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Sea's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Sky's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Sun's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Swamp's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "The Wind's Gift",
      "Type": [
         "Boon"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Tormentor",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack",
         "Doom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Tracker",
      "Cost": "2",
      "Type": [
         "Action",
         "Fate"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Tragic Hero",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Twice Miserable",
      "Type": [
         "State"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Vampire",
      "Cost": "5",
      "Type": [
         "Night",
         "Attack",
         "Doom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "War",
      "Type": [
         "Hex"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Werewolf",
      "Cost": "5",
      "Type": [
         "Action",
         "Night",
         "Attack",
         "Doom"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Will-o'-Wisp",
      "Cost": "0",
      "Type": [
         "Action",
         "Spirit"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Wish",
      "Cost": "0",
      "Type": [
         "Action"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Zombie Apprentice",
      "Cost": "3",
      "Type": [
         "Action",
         "Zombie"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Zombie Mason",
      "Cost": "3",
      "Type": [
         "Action",
         "Zombie"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Zombie Spy",
      "Cost": "3",
      "Type": [
         "Action",
         "Zombie"
      ],
      "Expansion": "Nocturne",
      "FAQ": "..."
   },
    {
      "Name": "Abundance",
      "Cost": "4",
      "Type": [
         "Treasure",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This triggers when you gain an Action card due to buying it, or gain one some other way.<br>- If it happens during another player's turn, the +^COIN3^ and +1 Buy won't be useful.<br>- See the Additional rules section for Duration cards in Dominion: Plunder regarding things happening \"the next time\".<br>- If gaining an Action card causes you to play this (e.g. you gain a Courier and play it with Innovation), that won't trigger the Abundance (it triggers off the next Action you gain)."
   },
    {
      "Name": "Amphora",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Duration",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When playing Amphora, choose whether to get +^COIN3^ and +1 Buy immediately, or at the start of your next turn.<br>- If you choose \"immediately,\" Amphora will be discarded in the same turn's Clean-up; if you choose \"next turn,\" Amphora will be discarded that turn.<br>- If you play Amphora multiple times, such as with King's Cache, you choose each time whether to get the +^COIN3^ and +1 Buy now or next turn, and Amphora only stays in play if at least one of the plays was for next turn (in which case the King's Cache also stays in play)."
   },
    {
      "Name": "Avoid",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you don't end up shuffling this turn, this does nothing.<br>- If you do shuffle, you first look through the cards and pick up to 3 to put into your discard pile. Shuffle the other cards normally, but don't shuffle those 3 in.<br>- Avoid is cumulative; if you Avoid 3 times, you will pick up to 9 cards to not shuffle in.<br>- You might leave so many cards in your discard pile that you don't have enough to draw; this does not trigger another shuffle, you just draw what you can.<br>- Putting cards into your discard pile doesn't count as discarding (e.g. it won't activate e.g. Village Green).<br>- If your next shuffle consists of your entire deck (e.g. you gained an Inn), you can look through your entire deck, and put cards from it directly into your discard pile."
   },
    {
      "Name": "Buried Treasure",
      "Cost": "5",
      "Type": [
         "Treasure",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you gain this, you have to play it; it's not optional."
   },
    {
      "Name": "Bury",
      "Cost": "1",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Once you buy this, the ability is mandatory.<br>- You cannot search through your discard pile prior to buying this Event to check if you want to buy it."
   },
    {
      "Name": "Cabin Boy",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You can trash a Cabin Boy to gain another Cabin Boy."
   },
    {
      "Name": "Cage",
      "Cost": "2",
      "Type": [
         "Treasure",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- The cards go to your hand after drawing your regular hand of 5 cards for next turn.<br>- For example you might set aside two Estates and two Coppers on a Cage on an early turn; then on a late turn, buy a Province, trash the Cage, and add the two Estates and two Coppers to your hand at end of turn.<br>- See the Additional rules section for Duration cards in Dominion: Plunder regarding things happening \"the next time\".<br>- If you set aside nothing with this, it will still stay in play until you gain a Victory card.<br>- If gaining a Victory card causes you to play this (e.g. you gain a Province, then gain a Cage with Haggler, and play it with Mining Road), that won't trigger the Cage (it triggers off the next Victory card you gain)."
   },
    {
      "Name": "Cheap",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This lowers the cost of a pile for the entire game (including when scoring).<br>- Costs can't go below ^COIN0^.<br>- This doesn't reduce non-^COIN^ like ^POTION^ and ^DEBT^, for example this does nothing on the Engineer pile (from Empires).<br>- This does not apply during setup; it can't for example cause a ^COIN4^ to be used as Young Witch's Bane (from Cornucopia)."
   },
    {
      "Name": "Crew",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Putting this onto your deck isn't optional.<br>- If you play this with a Command variant such as Overlord, the stop-moving rule means that Crew can't put itself onto your deck, and it isn't waiting for anything to happen. So you'll discard the Overlord from play during this turn's Clean-up."
   },
    {
      "Name": "Crucible",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- For example if you trash an Estate, which costs ^COIN2^ you get +^COIN2^.<br>- If you trash a card with ^DEBT^ or ^POTION^ in its cost (from other expansions), you get nothing for those symbols."
   },
    {
      "Name": "Cursed",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you gain a card from the Cursed pile, you also gain a Loot and a Curse.<br>- If there are no Curses left, you still gain a Loot."
   },
    {
      "Name": "Cutthroat",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Loot itself is a Treasure costing ^COIN5^ or more, so a player gaining one will trigger Cutthroats.<br>- See the Additional rules section for Duration cards in Dominion: Plunder regarding things happening \"the next time\".<br>- If you gain a Gold, that will trigger Cutthroats by all players (including ones that you already played). However, if the Gold gain causes you to play a Cutthroat (you gain one from Haggler and then play it with Rush), the Gold won't trigger the Cutthroat you just played (it triggers off your next Treasure gain).<br>- The \"next time\" effect gets set up after the other players discard. So if another player discards a Tunnel and gains a Gold, that won't cause you to gain a Loot."
   },
    {
      "Name": "Deliver",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Buying this more than once doesn't do anything extra.<br>- The set aside cards go into your hand after drawing your usual 5 cards."
   },
    {
      "Name": "Doubloons",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you gain this, you also gain a Gold."
   },
    {
      "Name": "Endless Chalice",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Duration",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Once played, this stays in play for the rest of the game."
   },
    {
      "Name": "Enlarge",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Once you've played Enlarge, trashing a card at the start of your next turn is mandatory."
   },
    {
      "Name": "Fated",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Each time you shuffle, you can choose to put Fated cards on the top or bottom of your deck, while shuffling the other cards normally.<br>&nbsp;&nbsp;- If for example you had five Fated cards, you could put two on top, one on the bottom, and leave the other two to be shuffled in.<br>- In games with Fated, you can look through your deck before shuffling, even if you're sure you don't have any Fated cards.<br>- If you put any Fated cards on top, they go on top of the shuffled cards, not on top of your deck. And if you put any Fated cards on the bottom, they go on the bottom of the shuffled cards, not on the bottom of your deck.<br>- If Patron is Fated, then revealing it when shuffling will give you +1 Coffers (assuming that it's an Action phase). If you reveal Patron, you have to put it either on top or bottom."
   },
    {
      "Name": "Fawning",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This is mandatory."
   },
    {
      "Name": "Figurehead",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Duration",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you play this, you get +^COIN3^ and at the start of your next turn, you get +2 Cards."
   },
    {
      "Name": "Figurine",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This is a Treasure, and so is played in your Buy phase, but draws cards.<br>- This means that usually if it draws you an Action card, that card won't be useful that turn, except that Figurine itself lets you discard one Action card for +1 Buy and +^COIN1^."
   },
    {
      "Name": "First Mate",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you don't have any Action cards to play, you'll still draw up to 6.<br>- If the Action card you play draws you another copy of itself, you can play that copy, and so on.<br>- First Mate can play First Mates; keep careful track of which card you're resolving, as you would with multiple Throne Rooms."
   },
    {
      "Name": "Flagship",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration",
         "Command"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This isn't optional; whatever that next non-Command Action card is, Flagship replays it.<br>- It replays it even if the card trashed itself, and even if it isn't your turn.<br>- Command cards, such as Flagship itself, are not replayed; Flagship waits for a non-Command Action card.<br>- If you play two Flagships and then e.g. a Harbor Village, you'll play the Harbor Village three times total - once normally and once for each Flagship.<br>- See the Additional rules section for Duration cards in Dominion: Plunder regarding things happening \"the next time\".<br>- If you play a Flagship and then a Band of Misfits, you will replay the card that the Band of Misfits plays. But if you play a Flagship and then a Necromancer, Flagship will replay the Necromancer (and you'll choose a 2nd card to play from the trash).<br>&nbsp;&nbsp;- If you play Flagship, then play a Band of Misfits, which plays a Duration card, the Flagship will replay that Duration card. The Band of Misfits will stay in play, but the Flagship will not; you will have to remember that the Duration card was played twice."
   },
    {
      "Name": "Foray",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you didn't have 3 cards to discard, you don't gain a Loot."
   },
    {
      "Name": "Fortune Hunter",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Completely resolve playing the Treasure before putting the other cards back on top; for example if the Treasure is a Figurine, the two cards you draw won't be the other ones you looked at with Fortune Hunter."
   },
    {
      "Name": "Friendly",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You may only discard one Friendly card per turn this way.<br>- If a split pile is Friendly, you can discard a Friendly card to gain a Friendly card with a different name (e.g. discard a Battle Plan to gain a Warlord).<br>- If Encampment is Friendly, you can first return a set-aside Encampment to its pile, and then discard an Encampment (or Plunder from your hand to regain it."
   },
    {
      "Name": "Frigate",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This applies each time another player plays an Action, until your next turn. That includes later on during your turn, if they manage to play an Action then (for example a Stowaway).<br>- They completely resolve playing the Action before discarding.<br>- An affected player can order this attack with other effects that trigger after playing an Action card. For example, they can first discard down to 4 cards in hand, and then spend a Favor for Fellowship of Scribes.<br>- Unlike other Duration Attacks (such as Swamp Hag), Frigate does nothing at the start of your next turn. This means that if this attack won't affect anyone (e.g., each other player blocks it with Moat), you'll immediately discard Frigate from play during your Clean-up.<br>- If a player reacts to Frigate being played with a Reaction that plays itself (e.g. Guard Dog), they won't discard down to 4 cards after playing that, because the Frigate's attack isn't active yet."
   },
    {
      "Name": "Gondola",
      "Cost": "4",
      "Type": [
         "Treasure",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When playing Gondola, choose whether to get +^COIN2^ immediately, or at the start of your next turn.<br>&nbsp;&nbsp;- If you choose \"immediately,\" Gondola will be discarded in the same turn's Clean-up; if you choose \"next turn,\" Gondola will be discarded that turn.<br>- If you play Gondola multiple times, such as with King's Cache, you choose each time whether to get the +^COIN2^ now or next turn, and Gondola only stays in play if at least one of the plays was for next turn (in which case the King's Cache also stays in play).<br>- Playing an Action card with this does not use up an Action.<br>- You can't play Treasures from your hand after you start buying cards. So if you gain this by buying it and play a Smithy, you won't be able to use the Treasure cards you draw.<br>- If playing an Action with this sets up a \"when you gain a card\" effect, that ability will trigger off the Gondola gain. This means you can gain a Gondola, play a Sailor, and then have that Sailor play the Gondola.<br>&nbsp;&nbsp;- The exception is if the Action says \"next time\" (e.g. Secluded Shrine), which will instead trigger off the next Treasure you gain."
   },
    {
      "Name": "Grotto",
      "Cost": "2",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- For example you could set aside 3 cards from your hand, and at the start of your next turn, discard those 3 cards, then draw 3 cards.<br>- If you set aside 0 cards, Grotto won't stay in play for your next turn."
   },
    {
      "Name": "Hammer",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Each time you play this, you get +^COIN3^ and gain a card costing up to ^COIN4^. This isn't optional."
   },
    {
      "Name": "Harbor Village",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This only cares if the Action itself gave you +^COIN^ not if you otherwise got +^COIN^ due to playing it (such as due to Training, from Adventures, or due to receiving The Forest's Gift, from Nocturne).<br>- It's okay if you no longer have the ^COIN^ (such as due to Storyteller†).<br>- +Coffers (from Guilds and Renaissance) is not +^COIN^.<br>- +^COIN0^ doesn't get you the bonus.<br>- Using a Way (from Menagerie) to get +^COIN^ (e.g. Way of the Sheep) does get you the bonus.<br>- If you Throne Room a Harbor Village and then play a Militia, you played Harbor Village, then Harbor Village, then Militia, so you get nothing for the first play of Harbor Village and +^COIN1^ for the second play of it.<br>- † The Storyteller example in the FAQ is referring to the original wording that gave you +^COIN1^. Other cards that can give +^COIN^ and make you lose ^COIN^ include Poor House, Souk, Capital City, and Black Market.<br>- If an Action makes +^COIN1^, but you have the -^COIN1^ token (from Bridge Troll and/or Ball), that reduces the Action's +^COIN1^ to +^COIN0^, so it won't count for Harbor Village. <br>- If Harbor Village has Inspiring, then the Action you play with it will be the \"next\" Action that Harbor Village checks for.<br>- Normally, if you play 2 consecutive Harbor Villages, the first one won't give +^COIN^ even if the second one ends up giving you +^COIN^. This is because you don't get +^COIN^ from the second Harbor Village until after playing a third Action card, and the first Harbor Village checks if you got +^COIN^ from the second Harbor Village before that happens.<br>&nbsp;&nbsp;- However, if Harbor Village has Inspiring and your 2nd Harbor Village causes you to play an Action giving +^COIN^ then the 2nd Harbor Village will give +^COIN^ early enough for the 1st Harbor Village to give +^COIN1^ for it.<br>&nbsp;&nbsp;- If you play Kiln, play Harbor Village, gain a 2nd Harbor Village and play it with Innovation, and then play a card giving +^COIN^ (e.g., Militia), both Harbor Villages will give +^COIN1^. This is because you play the second Harbor Village after putting the first Harbor Village in play, but before resolving it; therefore the Militia is the \"next\" Action card for both of them.<br>- If the next Action you play didn't give +^COIN^, but replaying that card causes it to give +^COIN^ (e.g. you play a Steward and choose +2 Cards, then call a Royal Carriage on the Steward and choose +^COIN2^), that won't count for Harbor Village.<br>&nbsp;&nbsp;- However, if the Steward is Reckless, and you choose +2 Cards and +^COIN2^, that will count for Harbor Village. <br>- If the next Action you play is an Inspiring Merchant, and Inspiring plays a Fortune Hunter that plays a Silver, that means Merchant gives +^COIN1^, which means Harbor Village also gives +^COIN1^."
   },
    {
      "Name": "Hasty",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If this plays a card that can't normally be played, like Territory (from Allies), that card goes into play but doesn't do anything else then.<br>- Playing a card that has no effect (like Territory) will still trigger e.g. Pathfinding, and it can count for e.g. Landing Party."
   },
    {
      "Name": "Inherited",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If they care, players decide which card to replace in turn order.<br>- Replaced Coppers go back to the pile; replaced Estates go back to the box.<br>- Replaced other cards (Shelters from Dark Ages, Heirlooms from Nocturne) go back to the box.<br>- If the Inherited pile is a split pile (from Empires or Allies), players take cards from the pile in turn order. So in a 6-player game with the Townsfolk pile, the first four players get a Town Crier, and the next two get a Blacksmith.<br>- Cards starting in your deck due to Inherited were never \"gained\" and did not trigger \"when you gain this\" effects."
   },
    {
      "Name": "Insignia",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you gain multiple cards, this applies to each of them - you can put any or all of them on top of your deck."
   },
    {
      "Name": "Inspiring",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you play an Inspiring card, after resolving it, you can play an Action card from your hand, provided that you don't have a copy of that card in play.<br>- Duration cards that you played on previous turns that are still in play, are in play; cards that have left play somehow, like a Mining Village (from Intrigue) trashing itself, are not in play.<br>- An Inspiring card can sometimes play a different Inspiring card (when Inspiring is on a split pile, like those in Empires and Allies), but can't normally play another copy of itself."
   },
    {
      "Name": "Invasion",
      "Cost": "10",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You do the four things in that order.<br>- Playing an Attack card is optional; the rest are mandatory.<br>- When you gain a Loot and play it, the No Visiting rule is not in effect; you gain the Loot to your discard pile, and then any on-gain triggers are activated, and then you play the Loot. If an on-gain trigger moves the Loot out of your discard pile (for example, you reveal a Watchtower to top-deck the Loot, the stop-moving rule prevents you from playing it."
   },
    {
      "Name": "Jewelled Egg",
      "Cost": "2",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- The player trashing Jewelled Egg gets the Loot, regardless of which player played the card that caused them to trash it."
   },
    {
      "Name": "Jewels",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Duration",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you play this, you get +^COIN3^ and +1 Buy, and at the start of your next turn, put this on the bottom of your deck.<br>- If a card plays this multiple times (e.g. King's Cache), then when you put this on the bottom of your deck, that card will remain in play until the Clean-up phase."
   },
    {
      "Name": "Journey",
      "Cost": "4",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Journey has received errata so that you can't take multiple extra turns in a row. Here are rulings that will change as a result.<br>- If you buy Journey multiple times in one turn, you aren't able to take more than 2 turns in a row, so all Journeys after the first will fail.<br>- If you buy Journey on an extra turn, your cards will stay in play, but you won't get an extra turn.<br>- If you set up multiple extra turns at once (e.g. one from Journey, one from Voyage), you choose one turn to take, and the others fail.<br>- If you are Possessed, and they make you buy Journey, anything they made you play will stay in play, you take a Journey turn, and then take your normal turn.<br>- You can only buy this once per turn. When you do, if the previous turn was not yours - if it was another player's turn before this turn - you don't discard cards from play this turn, and you take another turn after this turn ends. You still discard your hand.<br>- The extra turn is completely normal except that it doesn't count for the tiebreaker.<br>- Almost all \"while this is in play\" abilities have either received errata (e.g. Quarry) or been removed (e.g. Talisman). The exception is Urchin, which you can play during your regular turn, and then trash into a Mercenary on the Journey turn.<br>- If you play Lich and buy Journey on the same turn, your cards remain in play, the Journey turn gets skipped, and you'll discard those cards from play during the next Clean-up (yours or another player's).<br>- If you buy Journey, then any effects that care about cards that you discard from play this turn (e.g. Improve and Scheme) will do nothing. However, some effects trigger at the start of Clean-up (e.g. Alchemist and Walled Village), and they trigger normally.<br>- Journey's restriction only applies to your cards. Any cards that other players play (e.g. Mapmaker) will be discarded normally."
   },
    {
      "Name": "King's Cache",
      "Cost": "7",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you King's Cache a King's Cache, you will play three more Treasures three times each.<br>- If you King's Cache a Treasure-Duration card, King's Cache will stay in play as long as that card does.<br>- If you King's Cache a Capital, you end up with 6 debt when the Capital is discarded, not 18."
   },
    {
      "Name": "Landing Party",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Resolve the Treasure before putting Landing Party on your deck; for example if the Treasure is Figurine, you'd draw 2 cards before putting Landing Party on top.<br>- It's okay if the Treasure has more types, including Action (like Spell Scroll).<br>- See the Additional rules section for Duration cards in Dominion: Plunder regarding things happening \"the next time\".<br>- Duration cards that you played on previous turns that have an effect at the beginning of this turn, such as Caravan, don’t have any effect on whether you can top-deck Landing Party. Neither do Reserve cards put into play at the beginning of the turn by calling them, such as Transmogrify. Only the first card you actually play on the turn, and whether or not it is a Treasure, matters for Landing Party.<br>- The first card you play on your turn can be one that you play from your hand in the normal way, or it can be one played as a result of an “at the start of your turn” instruction, such as that of Piazza, Reap, or Royal Galley. What matters for start-of-your-turn instructions is whether they are actually telling you to “play” something.<br>- If you play this with a Command variant such as Band of Misfits, the stop-moving rule means that Landing Party can't put itself onto your deck, and it isn't waiting for anything to happen. So you'll discard the Band of Misfits from play during this turn's Clean-up.<br>- If the first Treasure you play is a Spell Scroll, which gains and plays a Landing Party, that will make you topdeck your other Landing Parties, but not the one you just played (it triggers off the next time your first card played is a Treasure).<br>- If you play a Treasure on someone else's turn (for example, if you gain a Buried Treasure as a result of a Barbarian attack and immediately play it), that can top-deck your Landing Parties."
   },
    {
      "Name": "Launch",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This ends your Buy phase and returns you to your Action phase.<br>- This does not cause \"start of turn\" abilities to repeat; however when your Buy phase happens again after that, \"start of Buy phase\" abilities can repeat.<br>- \"Once per turn\" applies to the whole Event.<br>- This counts as ending your Buy phase (for cards like Wine Merchant and Pageant). If you take multiple Buy phases, those cards will trigger multiple times.<br>- Unlike Cavalry, Launch draws you a card after ending your Buy phase. So if ending your Buy phase makes you put a Treasury onto your deck, you will draw it with Launch."
   },
    {
      "Name": "Longship",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Playing this gives you +2 Actions then, and +2 Cards at the start of your next turn."
   },
    {
      "Name": "Looting",
      "Cost": "6",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You simply gain a Loot."
   },
    {
      "Name": "Maelstrom",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This isn't optional for the other players; they must trash a card if they have 5 or more cards in hand."
   },
    {
      "Name": "Mapmaker",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you have fewer than four cards (after shuffling), you just look at what's left.<br>- You may play this when someone (including you) gains a Victory card due to buying it, or some other way.<br>- When you play Mapmaker in response to someone gaining a Victory card, you can immediately play another Mapmaker afterwards - even one you just got via the first Mapmaker.<br>- This plays like the Reactions in Menagerie; see the Reactions section."
   },
    {
      "Name": "Maroon",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Types are the words on the bottom banner of cards - Action, Attack, and so on.<br>- For example if you trash a Cage with Maroon, you'll draw 4 cards, since it's a Treasure and a Duration, 2 types.<br>- If the trashed card has a Trait, or is Young Witch's Bane, that won't count as an extra type for Maroon.<br>- Inheritance, Capitalism, and Charlatan will add types to cards."
   },
    {
      "Name": "Mining Road",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Playing the Treasure is optional.<br>- This ability is cumulative; if you play two Mining Roads, then twice that turn you may play a Treasure when you gain one. However two Mining Roads can't play the same gained Treasure twice.<br>- Mining Road applies to Treasures gained due to being bought, or gained other ways.<br>- It works in your Action phase if you gain a Treasure then.<br>- If gaining a Treasure causes you to gain a Treasure (e.g. a Fortune that gains a Gold), and you've played multiple Mining Roads, you can play those Treasures in any order (i.e. you can play the Gold before playing the Fortune)."
   },
    {
      "Name": "Mirror",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This is cumulative; if you buy Mirror three times and then buy an Action, you'll gain three extra copies of it."
   },
    {
      "Name": "Nearby",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Each time you gain a Nearby card, you get +1 Buy."
   },
    {
      "Name": "Orb",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- First look through your discard pile; then choose either to play an Action or Treasure from it, or to get +1 Buy and +^COIN3^."
   },
    {
      "Name": "Patient",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You can set aside multiple Patient cards at once; play them all at the start of your next turn, in any order.<br>- If this plays a card that can't normally be played, like Territory (from Allies), that card goes into play but doesn't do anything else then.<br>- Playing all the set aside cards is a single start-of-turn effect. Between playing each of those cards, you cannot resolve any other start-of-turn effects (for example, from Durations played last turn).<br>- If you have multiple Patient cards with different names, you can play them in any order. So if you set aside Sunken Treasure and Distant Shore, you can first play Sunken Treasure, gain a Distant Shore, then play the set-aside Distant Shore.<br>- If Patient cards get put into your hand at the start of Clean-up (e.g. you trash a Patient Fortress with Improve), you may set it aside to play it at the start of your next turn."
   },
    {
      "Name": "Pendant",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This counts itself. For example if you had three Coppers, a Gondola played last turn, and the Pendant in play, it would make +^COIN3^."
   },
    {
      "Name": "Peril",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You only gain a Loot if you trashed an Action card."
   },
    {
      "Name": "Pickaxe",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Trashing is mandatory, if you have any cards left in hand. Remember that you have to reveal the gained Loot."
   },
    {
      "Name": "Pilgrim",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- The card you put on top doesn't have to be one of the 4 you just drew."
   },
    {
      "Name": "Pious",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Each time you gain a Pious card, you may optionally trash a card from your hand."
   },
    {
      "Name": "Prepare",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Once you've set the cards aside, playing all of those Actions and Treasures next turn is mandatory.<br>- Between playing each of the set aside cards, you cannot play any cards from your hand, unless a card specifically tells you so (for example, Throne Room).<br>- Playing all the set aside cards is a single start-of-turn effect. Between playing each of those cards, you cannot resolve any other start-of-turn effects (for example, from Durations played last turn)."
   },
    {
      "Name": "Prize Goat",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Trashing a card is optional."
   },
    {
      "Name": "Prosper",
      "Cost": "10",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Gain the Loot first. Then, one at a time, you can choose differently named Treasures to gain, resolving each gain in turn.<br>- You don't have to gain any Treasures you don't want (after the Loot).<br>&nbsp;&nbsp;- For example in a game with Gondola, you might choose to gain Gondola, resolve its \"when gain\" ability to play a Trickster, then choose to gain a Gold and a Silver and then stop.<br>- Unlike Populate, this checks the types of a card and not the types of a pile. This is why Populate cannot gain an Estate that's been affected by Inheritance, but Prosper can gain a Curse that's been affected by Charlatan, or an Action that's been affected by Capitalism.<br>- Prosper can potentially gain multiple cards from the same pile. For example, if you have Capitalism, you can gain a Tent, revealing a Garrison that you can now gain."
   },
    {
      "Name": "Puzzle Box",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you set aside a card, the Puzzle Box itself is still discarded normally that turn.<br>- The set-aside card goes into your hand after drawing for the next turn."
   },
    {
      "Name": "Quartermaster",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Quartermaster stays in play for the rest of the game.<br>- Each turn you either gain a card and put it on the Quartermaster, or take one of the cards you've already gained with that Quartermaster and put it into your hand.<br>- If you play two Quartermasters, they each have their own set of cards. However if you Throne Room a Quartermaster, you just have one set of cards for it, and twice on each of your turns, either add one or take one.<br>- Cards that were gained and set aside on Quartermaster are still yours at the end of the game. So you can gain Estates and leave them set aside forever (effectively exiling them).<br>- The card you gain is immediately set aside, and doesn't visit your discard pile. So if you gain a Ghost Town, it will be set aside on this (instead of going to your hand).<br>- However, abilities that move cards when you gain them can move a card that's gained with Quartermaster. So if you gain a Siren with this, it will still trash itself (unless you trash an Action from your hand).<br>- If you use Throne Room on Overlord, and have it play 2 Quartermasters, there will be 2 sets of cards that cards are gained to. Overlord will stay in play forever, while Throne Room won't."
   },
    {
      "Name": "Reckless",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Reckless does two things, at different times. When you play a Reckless card, you follow its instructions an extra time - follow them entirely, then follow them again - and when you discard one from play, you return it to its Supply pile.<br>- With Duration cards those may not happen on the same turn.<br>- If you skip following the instructions of the card - for example by using a Way (from Menagerie) instead - then you don't follow them an extra time, but still return the card when discarding it from play.<br>- Just like Ways, if a Reckless card is affected by Enchantress and/or Highwayman, you won't do its instructions twice, and you still return the Reckless card to its pile when discarding it from play. [1]<br>&nbsp;&nbsp;- The exception is Way of the Chameleon, which tells you to \"follow this card's instructions.\" So if you play a Reckless card as Way of the Chameleon, you'll follow its instructions twice, switching +Cards and +^COIN^ both times. [2]<br>- Even though you follow a Reckless card's instructions twice, that only counts as 1 card played (which matters for e.g. Conspirator).<br>- Some cards care if it's the 1st time you played a copy of it this turn; if it's Reckless, both iterations will be the 1st time you played it. So your 1st Reckless Fool's Gold gives +^COIN2^, and your 1st Reckless Crossroads gives +6 Actions.<br>- Both iterations will count as something the card did. So if you play a Harbor Village, then play a Reckless Steward and choose +2 Cards and +^COIN2^, that will let Harbor Village give +^COIN1^. [3]<br>- Abilities that happen after playing a card (e.g. Frigate or Landing Party) are resolved (once) after you finish both iterations of a Reckless card.<br>- If a Reckless card is an Attack, a single Shield reveal (which you have to reveal before the first iteration of the Reckless card) will block both attacks (even if you want to get attacked the 2nd time). [4]<br>&nbsp;&nbsp;- If an attacked player draws a Shield as a result of the 1st attack (e.g. the attack was Soothsayer), they don't get to reveal the Shield against the 2nd attack.<br>- If a Reckless card never gets discarded from play (e.g. Quartermaster, Search, or a one-shot), you'll follow its instructions twice, but you'll never return it to its pile (so there's effectively no downside).<br>- If another card moves a Reckless card when it's discarded from play (e.g. Scheme), it'll fail to return to its pile.<br>- If Highwayman is Reckless, then when you discard it from play at the start of a turn, you'll return it to its pile, and then get +6 Cards."
   },
    {
      "Name": "Rich",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Each time you gain a Rich card, you also gain a Silver."
   },
    {
      "Name": "Rope",
      "Cost": "4",
      "Type": [
         "Treasure",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you play this, you get +^COIN1^ and +1 Buy, and at the start of your next turn, you first draw a card, then may trash a card from your hand."
   },
    {
      "Name": "Rush",
      "Cost": "2",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you Rush twice in a row, you'll still only play the Action once. You can however Rush, buy an Action and play it, Rush again, and buy another Action and play it.<br>- Remember that +X Actions you may acquire (the ability to play additional Action cards this turn) are only usable in the Action phase."
   },
    {
      "Name": "Sack of Loot",
      "Cost": "6",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you play this, you get +^COIN1^ and +1 Buy, and gain a Loot."
   },
    {
      "Name": "Scrounge",
      "Cost": "3",
      "Type": [
         "Event"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You may either trash a card from your hand, or may gain an Estate from the trash.<br>- If you gained an Estate, you then also gain a card costing up to ^COIN5^ from the Supply."
   },
    {
      "Name": "Search",
      "Cost": "2",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- If you Throne Room a Search, Throne Room will stay out with Search until a pile empties, and then you'll trash Search once but gain two Loots (and discard Throne Room that turn).<br>- See the Additional rules section for Duration cards in Dominion: Plunder regarding things happening \"the next time\".<br>- If multiple players have played a Search when a Supply pile empties, players trash their Searches and gain Loots in turn order.<br>- It doesn't matter if the Supply pile had already been emptied on a previous turn. So if you empty a pile, return copies to the Supply (with e.g. Swap), and empty it again, Search can trigger off that pile again.<br>- If a non-supply pile (like Loot or Horse) is emptied, that won't trigger Search.<br>- If gaining a card empties a Supply pile, you'll order Search with other when-gain effects. If trashing a card empties a Supply pile (e.g. Lurker), you'll order Search with other when-trash effects.<br>- If you Invest in the last card of a Supply pile, other players who also Invested in that card can order between the +2 Cards from Invest and trashing their Searches.<br>- If you play this with Band of Misfits, it will stay in play until a Supply pile empties. When one does, you trash nothing and gain a Loot.<br>- If emptying a Supply pile causes you to play this (e.g. you gain the last Gondola which lets you play a Search), that won't trigger the Search (it triggers off the next Supply pile that's emptied).<br>- Ending the game by emptying the third Supply pile, Provinces, or Colonies does trigger Search; you gain the Loot before the game ends. Usually this won't make a difference, but trashing Search and gaining Loot can affect your score due to abilities such as Fairgrounds, Tomb, and Keep, and there are a few abilities that might allow you to play the gained Loot before the end of your final turn and use it to buy some additional ^VP^."
   },
    {
      "Name": "Secluded Shrine",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This can trigger on any player's turn.<br>- It triggers even if the player can't or doesn't want to trash anything; they don't have to trash anything, but Secluded Shrine is done, and is discarded that turn.<br>- See the Additional rules section for Duration cards in Dominion: Plunder regarding things happening \"the next time\".<br>- If you gain a Gondola and play a Secluded Shrine, that will trigger your other Secluded Shrines, but not the one you just played (it triggers off your next Treasure gain)."
   },
    {
      "Name": "Sextant",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You can put all 5 cards back, or discard all 5, or anything in between."
   },
    {
      "Name": "Shaman",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- In games using Shaman, for the whole game, at the start of each of your turns (including extra turns), you gain a card from the trash costing up to ^COIN6^. This is mandatory.<br>- If there's no such card, you don't gain one.<br>- This applies even on your first turn (relevant with Necromancer, from Nocturne).<br>- It applies even if no-one ever gets a Shaman.<br>- The gained card goes into your discard pile. It's a card you gained, and can trigger things that care about that; for example gaining an Estate would trigger Cage's ability.<br>- You can order the gaining with other start-of-turn abilities. So if there are 0 cards in the trash, you can:<br>&nbsp;&nbsp;- First resolve Shaman, gain nothing, and then trash a Copper with Rope (for the next player to gain).<br>&nbsp;&nbsp;- First trash your Cabin Boy from play, and then gain it back from the trash with Shaman."
   },
    {
      "Name": "Shield",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Reaction",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You can reveal this when another player plays an Attack card to be unaffected by it, exactly as with Moat.<br>- You do this before the Attack card has done anything, and can use Shield against multiple Attacks in a turn.<br>- Shield stays in your hand and can still be played for +^COIN3^ and +1 Buy on your turn."
   },
    {
      "Name": "Shy",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You can only discard one Shy card per turn this way."
   },
    {
      "Name": "Silver Mine",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This can gain Silver, but also other Treasures costing less than Silver Mine, when in the Supply: Gondola, Jewelled Egg, and so on."
   },
    {
      "Name": "Siren",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Plunder",
      "FAQ": "- When you gain a Siren, it's immediately trashed unless you trash an Action card from your hand.<br>- However if you manage to move the Siren from where it was gained (whether it was gained to your discard pile or somewhere else) before resolving this ability - for example putting it on top of your deck with Insignia - then it will fail to be trashed (though you can still trash an Action card if you want).<br>- The important part of getting around Siren's self-trashing effect is to move it when it's gained. This is why Insignia works, but the following does not:<br>&nbsp;&nbsp;- Some cards directly gain a card somewhere (e.g. Invasion gains an Action directly onto your deck). This does not actually move the Siren, so it will still trash itself.<br>&nbsp;&nbsp;- A few other cards gain a card and then move it later. So if you gain a Siren with Spell Scroll, the Siren will trash itself, and the Spell Scroll will fail to play it.<br>- If you have an Action in hand, you can decline to trash it, and let the Siren trash itself. This may still be useful if you want to trigger when-trash effects (such as Sewers or Market Square)."
   },
    {
      "Name": "Spell Scroll",
      "Cost": "7",
      "Type": [
         "Action",
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You can play this in your Action phase or Buy phase; if played in your Action phase, it uses up an Action play for the turn. However playing the card you gain from Spell Scroll does not use up an Action play."
   },
    {
      "Name": "Staff",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Playing an Action card from your hand is optional."
   },
    {
      "Name": "Stowaway",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration",
         "Reaction"
      ],
      "Expansion": "Plunder",
      "FAQ": "- You may play this from your hand when you personally gain a Duration card, or when another player does.<br>- This plays like the Reactions in MenagerieMenagerie (expansion).jpg; see the Reactions section."
   },
    {
      "Name": "Swamp Shacks",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This counts the Swamp Shacks itself, and Duration cards played on previous turns that are still in play.<br>- It counts Treasures if you have some in play, such as Treasure Duration cards, or due to Fortune Hunter.<br>- It does not count set aside cards, such as cards on a Quartermaster.<br>- Round down the number of cards you draw; if you have 8 cards in play, you draw 2."
   },
    {
      "Name": "Sword",
      "Cost": "7",
      "Type": [
         "Treasure",
         "Attack",
         "Loot"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This is an Attack, and so cards like Moat and Shield protect from it."
   },
    {
      "Name": "Taskmaster",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Plunder",
      "FAQ": "- Taskmaster can end up making +1 Action and +^COIN1^ turn after turn, as long as you keep gaining at least one card costing ^COIN5^.<br>- It only matters what the card cost when you gained it, not what it costs at other times.<br>- Taskmaster does not count cards gained before playing it.<br>- Repeating Taskmaster's ability doesn't count as playing it again (which means you can't use a Way to make Taskmaster do something other than its usual ability at this point, and it won't count for Conspirator).<br>- At the start of your turn, you can first repeat this ability, then gain a Duchy with Importer, and that will let the Taskmaster repeat itself on your next turn.<br>- This checks the cost that a card had at the moment you gained it. So if you gain a Destrier that costs ^COIN6^, that won't count for Taskmaster (even though its own gain means it now costs ^COIN5^). But if you gain a Destrier that costs ^COIN5^ (meaning it now costs ^COIN4^), that lets Taskmaster repeat itself.<br>- If gaining a ^COIN5^-cost card causes you to play a Taskmaster (e.g. you play Haggler and buy a ^COIN5^ card, and then gain a Taskmaster with Haggler's ability and play the Taskmaster with Innovation), that will let the Taskmaster repeat itself on your next turn.<br>- If you haven't gained a ^COIN5^-cost card this turn, Taskmaster can be trashed with Improve. But if you gain a ^COIN5^-cost card afterwards (with a 2nd Improve), the Taskmaster will still repeat itself on your next turn (and potentially for multiple turns); you will have to remember this."
   },
    {
      "Name": "Tireless",
      "Type": [
         "Trait"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This is mandatory.<br>- You draw your next hand before putting the card onto your deck.<br>- If a Tireless card never gets discarded from play (e.g. it's Quartermaster, Crew, or a one-shot), then Tireless will have no effect.<br>- If something else moves a Tireless card when it's discarded from play (e.g. Scheme), you won't set it aside.<br>- If a Tireless card discards itself from play at a weird time (e.g. Highwayman), you'll still set it aside and put it onto your deck at the end of the turn.<br>- If a split pile is Tireless, you can put the cards onto your deck in any order.<br>- If you have an ability that gives you +Cards at the end of your turn (from e.g. Way of the Squirrel or Farrier), you can top-deck your Tireless card before or after taking the +Cards. If you top-deck first, you will draw the Tireless card immediately and it will be in your hand during your opponent's turn.<br>&nbsp;&nbsp;- Note that some things draw extra cards when you draw your Clean-up hand (e.g. Flag or Expedition), which will happen before you topdeck Tireless cards."
   },
    {
      "Name": "Tools",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This can gain a copy of a card any player has in play; other players may for example have Duration cards in play.<br>- Tools itself is in play, so you can gain a copy of that.<br>- This can't gain a copy of a card that isn't in the Supply (such as Loot). However, you can still try to gain a copy of it (and gain nothing)."
   },
    {
      "Name": "Trickster",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Plunder",
      "FAQ": "- This is cumulative; if you play two Tricksters, then you can set aside up to two Treasures you discard from play and put them into your hand at end of turn, after drawing."
   },
    {
      "Name": "Wealthy Village",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Plunder",
      "FAQ": "- The 3 differently named Treasures can include Duration Treasures you played on a previous turn, and Loots themselves."
   },
    {
      "Name": "Avanto",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Black Market",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Captain",
      "Cost": "6",
      "Type": [
         "Action",
         "Duration",
         "Command"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Church",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Dismantle",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Envoy",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Governor",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Marchland",
      "Cost": "5",
      "Type": [
         "Victory"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Prince",
      "Cost": "8",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Sauna",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Stash",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Summon",
      "Cost": "5",
      "Type": [
         "Event"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Walled Village",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Promo",
      "FAQ": "..."
   },
    {
      "Name": "Bank",
      "Cost": "7",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- When you play Bank, it makes +^COIN1^ per Treasure you have in play, counting itself.<br>- If you play two copies of Bank in a row, the second one will make ^COIN1^ more than the first one.<br>- Playing more Treasures after Bank will not change how much ^COIN^ you got from it.<br>- Example turn: You play 2 Coppers followed by a Crystal Ball. The Crystal Ball causes you to play a Bank which produces +^COIN4^. You play another Crystal Ball which causes you to play another Bank, which produces +^COIN6^ giving you a total of ^COIN14^ to spend.<br>- It doesn't matter whether the other Treasures you have in play gave you ^COIN^ when you played them (some that don't include Potion or Horn of Plenty); Bank will still give you ^COIN^ for them."
   },
    {
      "Name": "Bishop",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- Trashing a card is optional for the other players but mandatory for you.<br>- If players care about the order things happen for this, you trash a card first, then each other player may trash a card, in turn order.<br>- Only the player who played Bishop can get ^VP^ tokens from it.<br>- ^POTION^ and ^DEBT^ in costs is ignored, for example if you trash Golem (from Dominion: Alchemy), which costs ^COIN4^^POTION^, you get 3^VP^ total.<br>- If you have no cards left in hand to trash, you still get the ^COIN1^ and 1^VP^."
   },
    {
      "Name": "City",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- You draw a card and get +2 Actions no matter what.<br>- If there is just one empty pile in the Supply, you also draw another card.<br>- If there are two or more empty piles, you both draw another card, and get +^COIN1^ and +1 Buy.<br>- There are no further bonuses if three or more piles are empty.<br>- This only checks how many piles are empty when you play it; what you got does not change if a pile becomes empty (or non-empty, such as due to Encampment from Empires).<br>- This only counts Supply piles, not non-Supply piles like Spoils from Dark Ages.<br>- Other rules clarifications<br>- Unlike Laboratory, if you play this when a pile is empty, you draw a card, then draw a second card separately. So if you only have 1 card in your deck, you can see that card before shuffling and topdecking a card with Star Chart."
   },
    {
      "Name": "Colony",
      "Cost": "11",
      "Type": [
         "Victory"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- This is not a Kingdom card. You do not use it every game; see the Preparation section. It is a Victory card worth 10^VP^"
   },
    {
      "Name": "Expand",
      "Cost": "7",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- If you do not have a card to trash, you do not gain one.<br>- If you do gain a card, it comes from the Supply and is put into your discard pile.<br>- The gained card does not need to cost exactly ^COIN3^ more than the trashed card; it can cost that much or less, and can even be another copy of the trashed card.<br>- ^POTION^ is counted as part of the cost, so you could Expand a Familiar into a Possession."
   },
    {
      "Name": "Forge",
      "Cost": "7",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- \"Any number\" includes zero.<br>- If you trash no cards, you have to gain a card costing ^COIN0^ if you can.<br>- If there is no card at the required cost, you do not gain a card.<br>- The card you gain comes from the Supply and is put into your discard pile.<br>- ^POTION^ (on cards in Dominion: Alchemy) and ^DEBT^ (on cards in Dominion: Empires) are not added, and the card you gain cannot have those symbols in its cost."
   },
    {
      "Name": "Grand Market",
      "Cost": "6",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- A single Copper in play is enough to stop you from buying Grand Market.<br>- You do not have to play all of the Treasures in your hand.<br>- Coppers in your hand do not stop you from buying Grand Market - only Coppers in play do.<br>- Coppers that were in play earlier in the turn but aren't anymore also do not stop you; if you have 11 Coppers in play and 2 Buys, you could buy a Mint, trash all of your played Treasures, and then buy a Grand Market.<br>- You can gain Grand Market other ways - for example with Expand - whether or not you have Coppers in play.<br>- Treasures other than Copper do not prevent you from buying Grand Market, even if they are worth ^COIN1^ (such as Crystal Ball).<br>- Remember you cannot play more Treasures after buying a card."
   },
    {
      "Name": "Hoard",
      "Cost": "6",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- You only gain a Gold when you gain a Victory card that you bought, not when you gain a Victory card other ways (such as via War Chest).<br>- The Gold comes from the Supply and is put into your discard pile.<br>- This is cumulative, and works on all gains; for example if you have two Hoards in play, and buy and gain two Estates, you'll gain four Golds total.<br>- Hoard got errata in 2022 so that it's no longer a while-in-play effect, and the Gold gain was delayed to when you gained the bought Victory card.<br>- If you play this twice with e.g. Tiara or Crown, buying and gaining a Victory card will gain you two Golds."
   },
    {
      "Name": "King's Court",
      "Cost": "7",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- This is similar to Throne Room, but plays the Action three times rather than twice.<br>- Playing an Action card from your hand is optional.<br>- If you do play one, you resolve it completely, then play it a second time, then play it a third time.<br>- You cannot play other cards in-between (unless told to by the card, such as with King's Court itself).<br>- Playing Action cards with King's Court is just like playing Action cards normally, except it does not use up Action plays for the turn.<br>- For example if you start a turn by playing King's Court on Village, you would draw a card, get +2 Actions, draw another card, get +2 Actions again, draw a 3rd card, and get +2 Actions again, leaving you with 6 Actions.<br>- If you King's Court a King's Court, you may play an Action card three times, then may play another Action card three times, then may play a 3rd Action card three times; you do not play one Action card nine times."
   },
    {
      "Name": "Mint",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- When you gain this, you trash all of your non-Duration Treasure cards from play (but not ones in your hand or elsewhere). (Duration cards are in other expansions, such as Seaside).<br>- This doesn't cause you to lose the ^COIN^ you made from those cards this turn.<br>- Remember that you don't have to play all of the Treasures from your hand each turn, just the ones you want to play, and you can't play more Treasures after buying cards.<br>- If you gain this in your Action phase, such as with Artisan, you will usually not have any Treasures in play to trash.<br>- When you play this, you may reveal a Treasure from your hand to gain a copy of it from the Supply, putting the gained card into your discard pile.<br>- The revealed card stays in your hand and can still be played that turn.<br>- If you gain a Mint with Tiara in play, you can put the Mint on your deck, regardless of whether you trash the Tiara before or afterwards.<br>- If you have Capitalism, Mint can both gain and trash Action-Treasures.<br>- If you played some Coppers, but trashed them all with Mint, that means you're allowed to buy a Grand Market.<br>- If you first gain Mandarin and top-deck all your Treasures, gaining Mint won't trash any Treasures.<br>- Mint can only gain copies from the Supply, so it can't gain copies of Spoils, Heirlooms, or Treasures from the Black Market deck."
   },
    {
      "Name": "Monument",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- You get +^COIN2^ and take a ^VP^ token."
   },
    {
      "Name": "Peddler",
      "Cost": "8",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- Most of the time, this costs ^COIN8^.<br>- During a player's Buy phase, this costs ^COIN2^ less per Action card that player has in play.<br>- This applies to all Peddler cards, including ones in hands and decks.<br>- It never costs less than ^COIN0^.<br>- If you play King's Court on Worker's Village, for example, that's just two Action cards you have in play, even though you played the Worker's Village three times.<br>- Buying cards using the promotional card Black Market is something that does not happen during a Buy phase, so Peddler still costs ^COIN8^ then.<br>- During your Buy phase, if you get more Action cards into your play area (with e.g. Toil), Peddler's cost will be further reduced. And if any Action cards leave your play area (e.g. you Scepter a card and play it as Way of the Butterfly), Peddler's cost will increase.<br>&nbsp;&nbsp;- Crown is an Action card, even if you play it as a Treasure in the Buy phase, and so playing it in the Buy phase affects Peddler's cost.<br>&nbsp;&nbsp;- hen an Action is played during the Buy phase, Peddler's cost changes as soon as the new card enters your play area. So if you have 1 Action in play and then play a Workshop (with e.g. Toil), Peddler now costs ^COIN4^, and can be gained by Workshop's effect.<br>- Unlike Destrier, this changes cost only during your Buy phase. So if you return to your Action phase (with e.g. Villa or Cavalry), or enter your Night and/or Clean-up phase, Peddler will return to its normal cost of ^COIN8^."
   },
    {
      "Name": "Platinum",
      "Cost": "9",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- This is not a Kingdom card. You do not use it every game; see the Preparation section. It is a Treasure worth ^COIN5^."
   },
    {
      "Name": "Quarry",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- All Action cards, including cards in the Supply, in play, in decks, and in hands, cost ^COIN2^ less for the rest of the turn, but not less than ^COIN0^.<br>- This is cumulative; if you play two Quarries in your Buy phase, then King's Court will only cost ^COIN3^, rather than the usual ^COIN7^.<br>- This is also cumulative with other effects that modify costs.<br>- With the 2022 updated release, Quarry (as well as Hoard) was tweaked to lose its \"while in play\" wording, converting it to \"this turn\".<br>- If you play this twice with e.g. Tiara or Crown, costs will be reduced by ^COIN4^, to a minimum of ^COIN0^."
   },
    {
      "Name": "Rabble",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- The other players shuffle if necessary to get 3 cards to reveal, and just reveal what they can if they still have fewer than 3 cards.<br>- They discard revealed Treasures and Actions and put the rest back on top in whatever order they want.<br>- The order in which cards were returned to your deck is public knowledge.<br>- Night cards are not Treasures or Actions (except Werewolf), so they are not discarded by the attack."
   },
    {
      "Name": "Vault",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- \"Any number\" includes zero.<br>- You draw 2 cards first; the cards you just drew can be among the cards you discard.<br>- Each other player chooses whether or not to discard 2 cards, then discards 2 cards if they chose to, then draws a card if they did discard 2 cards.<br>- A player with just one card can choose to discard it, but won't draw a card.<br>- A player who discards but then has no cards left to draw shuffles in the discards before drawing."
   },
    {
      "Name": "Watchtower",
      "Cost": "3",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- When you play this, you draw cards one at a time until you have 6 cards in hand.<br>- If you have 6 or more cards in hand already, you don't draw any cards.<br>- When you gain a card, directly afterwards, you may reveal Watchtower from your hand, to either trash the gained card or put it on top of your deck (with Watchtower staying in your hand).<br>- You may reveal Watchtower whether you gained the card due to buying it, or gained it some other way, such as with Expand or Mountebank.<br>- You may reveal Watchtower each time you gain a card, and each gain is a separate decision; for example if another player plays Mountebank, you may reveal Watchtower to trash both the Copper and Curse, or just one, or trash one and put the other on your deck, and so on.<br>- Cards trashed with Watchtower were still gained; they were just immediately trashed afterwards.<br>- If a gained card is going somewhere other than to your discard pile, such as a card gained with Mine, you can still use Watchtower to trash it or put it on your deck.<br>- Trashing a card with Watchtower does not prevent on-gain effects from happening.<br>- Watchtower's topdecking happens after the gain happens; the card still visits the discard pile, or whatever location it was gained to.<br>- Watchtower's topdecking has the same timing as on-gain effects, so for example you could choose to topdeck Death Cart before gaining the 2 Ruins.<br>- If you gain a Watchtower to your hand (with e.g. Artisan), you can react with that Watchtower to either trash or topdeck itself."
   },
    {
      "Name": "Worker's Village",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity",
      "FAQ": "- You draw a card and get +2 Actions and +1 Buy."
   },
    {
      "Name": "Contraband",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- When you play this, you get ^COIN3^ and +1 Buy.<br>- The player to your left names a card, and you cannot buy the named card this turn.<br>- This does not stop you from gaining the card in ways other than buying it (such as via Hoard [or Dominate]).<br>- They do not have to name a card in the Supply.<br>- If you play multiple Contrabands in one turn, the player to your left names a card each time; if they name different cards, you cannot buy any of the named cards this turn.<br>- If you play Contraband before other Treasures, you hide how much ^COIN^ you will have; however the number of cards left in a player's hand is public information."
   },
    {
      "Name": "Counting House",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- This card lets you look through your discard pile, something you normally are not allowed to do.<br>- You only get to look through your discard pile when you play this.<br>- You do not have to show the other players your entire discard pile, just the Coppers you take out.<br>- After you take out the Coppers, you can leave your discard pile in any order."
   },
    {
      "Name": "Goons",
      "Cost": "6",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- You get +1^VP^ per card you buy, but do not get +1^VP^ for gaining a card some other way.<br>- Multiple copies of Goons are cumulative; if you have two Goons in play and buy a Silver, you'll get +2^VP^.<br>- However if you King's Court a Goons, despite having played the card 3 times, there is still only one copy of it in play, so buying Silver would only get you +1^VP^.<br>- Buying Events does not give you ^VP^."
   },
    {
      "Name": "Loan",
      "Cost": "3",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- When you play Loan, you get ^COIN1^, reveal cards from the top of your deck until revealing a Treasure card, and then decide whether to trash that card or discard it.<br>- Then you discard all of the other revealed cards.<br>- If you run out of cards before revealing a Treasure, shuffle your discard pile (but not the revealed cards) to get more; if you still do not find a Treasure, just discard all of the revealed cards."
   },
    {
      "Name": "Mountebank",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- This hits the other players in turn order, which can matter when the Curse or Copper piles are low.<br>- Each of the other players in turn chooses whether or not to discard a Curse card, and the players who do not gain a Curse and a Copper from the Supply, putting them into their discard piles.<br>- If either the Curse or Copper pile is empty, players still gain the other card.<br>- A player hit by Mountebank gains the Curse first, and then the Copper."
   },
    {
      "Name": "Royal Seal",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- If you gain multiple cards with this in play, this applies to each of them - you could put any or all of them on top of your deck.<br>- This applies both to cards gained due to being bought, and to cards gained other ways with Royal Seal in play, such as with Hoard.<br>- If Royal Seal is no longer in play when you gain a card, such as because it was trashed with Mint or top-decked with Mandarin, you cannot use its ability."
   },
    {
      "Name": "Talisman",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- Each time you buy a non-Victory card costing ^COIN4^ or less with this in play, you gain another copy of the bought card.<br>- If there are no copies left, you do not gain one.<br>- The gained card comes from the Supply and goes into your discard pile.<br>- If you have multiple Talismans, you gain an additional copy for each one; if you buy multiple cards for ^COIN4^ or less, Talisman applies to each one.<br>- For example if you have two Talismans, four Coppers, and two Buys, you could buy Silver and Trade Route, gaining two more Silvers and two more Trade Routes.<br>- Talisman only affects buying cards; it does not work on cards gained other ways, such as with Expand.<br>- Talisman only cares about the cost of the card when you buy it, not its normal cost; so for example it can get you a Peddler if you have played two Actions this turn, thus lowering Peddler’s cost to ^COIN4^, or can get you a Grand Market if you have a Quarry in play.<br>- When you buy a card from the Black Market deck, you do not get a second copy of it even if Talisman is in play, since there is no second copy in the Supply.<br>- Talisman, like most other gainers, cannot be used to gain cards with ^POTION^ or ^DEBT^ in their cost.<br>- This checks the cost of a card when you buy it, even if it changes later. So if you buy a Fisherman for ^COIN2^ and then gain a Sleigh with Charm, you will gain a second Fisherman, even though it now costs ^COIN5^."
   },
    {
      "Name": "Trade Route",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- You get +1 Buy, and trash a card from your hand if you can.<br>- Then you get +^COIN1^ per Coin token on the Trade Route mat.<br>- This card has setup; at the start of games using it, you put a Coin token on each Victory card pile being used (including Kingdom card piles such as Gardens, and Colonies if used).<br>- In the rare cases where there are more than 8 Victory piles, the tokens are not counter-limited; use a replacement.<br>- Whenever any player gains the first card from a Victory card pile - whether by buying it or otherwise gaining it - the Coin token is moved to the mat.<br>- So if no Victory cards have been gained this game, the mat has no tokens and Trade Route makes +^COIN0^; if four Provinces and one Estate have been gained, the mat has two tokens and Trade Route makes +^COIN2^.<br>- If you are using the promotional card Black Market, and Trade Route is in the Black Market deck, you do the setup for Trade Route.<br>- Certain Victory cards come from split piles that are not themselves Victory card piles, such as Dame Josephine and Territory; gaining them does not add a token to the Trade Route mat.<br>&nbsp;&nbsp;- However Castles are a Victory Card pile.<br>- The Trade Route token on a pile will not move if the top card of a pile is removed without gaining it, such as when you trash it with Salt the Earth, or exile it with Way of the Worm or Enclave.<br>- If you gain a Victory card from the trash, you still move a Coin token from its Supply pile to the mat.<br>- You get +^COIN^ after trashing a card. So if you trash a Hunting Grounds and gain the first Duchy, that will increase the +^COIN^ you get from this."
   },
    {
      "Name": "Venture",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 1E",
      "FAQ": "- When you play Venture, you reveal cards from your deck until revealing a Treasure card.<br>- If you run out of cards before revealing a Treasure, shuffle your discard pile (but not the revealed cards) to get more; if you still don't find a Treasure, just discard all of the revealed cards.<br>- If you do find a Treasure, discard the other cards and play the Treasure.<br>- If that Treasure does something when played, do that something.<br>- For example if Venture finds you another Venture, you reveal cards again."
   },
    {
      "Name": "Anvil",
      "Cost": "3",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- Discarding a Treasure is optional.<br>- If you discard one, you gain a card costing up to ^COIN4^ which comes from the Supply and goes to your discard pile."
   },
    {
      "Name": "Charlatan",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- This turns Curses into Treasures for the entire game and in all situations; it's just like the bottom bar says \"Curse - Treasure.\"<br>- They may be played for +^COIN1^ in the Buy phase. They are trashed from play when gaining Mint, Magnate counts them in your hand, Courtier (from Intrigue) gives you two choices when revealing one, and so on.<br>- They are still Curses and still worth –1^VP^ at the end of the game.<br>- Curses in the trash are Treasures, which may matter for e.g. Forager.<br>- Unlike Capitalism, Charlatan makes Curses stay as Treasures during scoring, so they will count for Keep.<br>- Curses will be Treasures if Charlatan is in the Black Market deck, even if no one actually gains it."
   },
    {
      "Name": "Clerk",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction",
         "Attack"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- A player with no cards in their deck will have the card they put on top become the only card in their deck.<br>- At the start of your turn, you may play any number of Clerk cards from your hand, one at a time, without using up your regular Action play.<br>- You may use Clerk's self-playing start-of-turn ability before, between, or after other start-of-turn effects. For instance, if you draw Clerk due to the effect of Den of Sin, it's not too late to use Clerk's Reaction ability."
   },
    {
      "Name": "Collection",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- You get +1^VP^ for each Action card you gain, whether bought, or gained some other way.<br>- Multiple copies of this are cumulative; if you have two Collections in play and buy a Village, you'll get +2^VP^.<br>- You only get ^VP^ for Actions you gain after you play the Collection; it doesn't retroactively give you points for cards you gained earlier in the turn.<br>- If the Collection leaves play (for instance, because you trashed it with Counterfeit), you still get ^VP^ from it for the rest of the turn."
   },
    {
      "Name": "Crystal Ball",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- If you don't choose to do any of those things, you leave the card on your deck.<br>- If this plays an Action during your Buy phase that gives you +Actions, that doesn't let you play more Action cards in your Buy phase; if it draws Treasure cards, you can still play them."
   },
    {
      "Name": "Investment",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- You trash a card no matter what; it's okay if Investment was your last card in hand, you just fail to trash a card then.<br>- Then you choose either to get +^COIN1^, or to trash Investment.<br>- If you trash it, you reveal your hand and get +1^VP^ per differently named Treasure there; for example if you reveal two Coppers and a Silver, you get +2^VP^.<br>- You can still play the revealed Treasures after resolving Investment.<br>- If you play the same Investment twice (e.g. with Crown) and trash it on the first play for ^VP^, then you can't trash it on the second play for ^VP^."
   },
    {
      "Name": "Magnate",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- For example, if your hand had two Coppers and a Silver, you'd draw 3 cards."
   },
    {
      "Name": "Tiara",
      "Cost": "4",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- If you gain multiple cards later in the turn after playing Tiara, you may put any or all of them onto your deck.<br>- This applies both to cards gained due to being bought, and to cards gained other ways, such as with War Chest.<br>- If you play a Tiara with a Tiara, you will be able to play two Treasures from your hand twice each - you don't play one Treasure four times."
   },
    {
      "Name": "War Chest",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Prosperity, 2E",
      "FAQ": "- The first War Chest you play in a turn can't gain whatever card they name; the second can't gain the card they name, or the card they previously named, and so on.<br>- The gained card comes from the Supply and is put into your discard pile.<br>- You can still gain the named cards other ways, just not via War Chests.<br>- They do not have to name a card in the Supply; however War Chest gains a card from the Supply, and puts it into your discard pile."
   },
    {
      "Name": "Academy",
      "Cost": "5",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Acting Troupe",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Barracks",
      "Cost": "6",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Border Guard",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Canal",
      "Cost": "7",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Capitalism",
      "Cost": "5",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Cargo Ship",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Cathedral",
      "Cost": "3",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Citadel",
      "Cost": "8",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "City Gate",
      "Cost": "3",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Crop Rotation",
      "Cost": "6",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Ducat",
      "Cost": "2",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Experiment",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Exploration",
      "Cost": "4",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Fair",
      "Cost": "4",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Flag",
      "Type": [
         "Artifact"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Flag Bearer",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Fleet",
      "Cost": "5",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Guildhall",
      "Cost": "5",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Hideout",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Horn",
      "Type": [
         "Artifact"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Improve",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Innovation",
      "Cost": "6",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Inventor",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Key",
      "Type": [
         "Artifact"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Lackeys",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Lantern",
      "Type": [
         "Artifact"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Mountain Village",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Old Witch",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Pageant",
      "Cost": "3",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Patron",
      "Cost": "4",
      "Type": [
         "Action",
         "Reaction"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Piazza",
      "Cost": "5",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Priest",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Recruiter",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Research",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Road Network",
      "Cost": "5",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Scepter",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Scholar",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Sculptor",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Seer",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Sewers",
      "Cost": "3",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Silk Merchant",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Silos",
      "Cost": "4",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Sinister Plot",
      "Cost": "4",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Spices",
      "Cost": "5",
      "Type": [
         "Treasure"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Star Chart",
      "Cost": "3",
      "Type": [
         "Project"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Swashbuckler",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Treasure Chest",
      "Type": [
         "Artifact"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Treasurer",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Villain",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Renaissance",
      "FAQ": "..."
   },
    {
      "Name": "Bazaar",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- You draw a card and get +2 Actions and +^COIN1^."
   },
    {
      "Name": "Caravan",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- You draw a card and get +1 Action when you play this, and then you draw another card at the start of your next turn."
   },
    {
      "Name": "Cutpurse",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Seaside",
      "FAQ": "- Each of your opponents with at least one Copper in hand discards one Copper.<br>- Each of your opponents with no Coppers in hand reveals their hand to prove this."
   },
    {
      "Name": "Fishing Village",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- You get +2 Actions and +^COIN1^ when you play this, and then +1 Action and +^COIN1^ at the start of your next turn."
   },
    {
      "Name": "Haven",
      "Cost": "2",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- First draw a card and get +1 Action; then choose a card from your hand and set it aside face down under Haven.<br>- You may look at it, but other players may not.<br>- You have to set aside a card if you can.<br>- At the start of your next turn, return the set aside card to your hand.<br>- If you have no card in your hand to set aside when you play Haven, you set aside nothing, and clean up Haven at the end of that turn; it does not stay out.<br>- If Haven is still in play when the game ends, it and the card set aside with it are returned to your deck before scoring; this can matter for alt-VP cards like Gardens."
   },
    {
      "Name": "Island",
      "Cost": "4",
      "Type": [
         "Action",
         "Victory"
      ],
      "Expansion": "Seaside",
      "FAQ": "- When you set aside your first Island, take an Island player mat to put it on.<br>- Island and the set aside card are face up on the mat; anyone can look at them.<br>- They stay there until the end of the game, when you return them to your deck and count your score.<br>- When playing Island, you have to set aside a card if you can.<br>- If you Throne Room an Island, you set aside two cards with it.<br>- Use 8 copies of Island for games with 2 players, 12 for games with 3 or more players.<br>- If you Procession an Island, you set it aside with a card, then you set aside another card; you do not trash the Island because it has already been set aside, but you do gain a card costing ^COIN1^ more than the Island.<br>- If you play a Command variant that plays an Island, you leave the Island in its pile and you move a card to the Island mat."
   },
    {
      "Name": "Lighthouse",
      "Cost": "2",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- Between when you play Lighthouse and the start of your next turn, Attack cards other players play don't affect you (even if you want them to).<br>- This does not prevent you from using Reactions when other players play Attacks.<br>- Lighthouse only protects you from Attacks if the Lighthouse is in effect when the Attack is played, regardless of when the Attack's effects would hit you. So for example, if you get attacked by Corsair or Blockade, playing a Lighthouse afterwards will not protect you from their attacks.<br>- This protects you for the rest of the turn when you play it. So for example, if after playing a Lighthouse, you gain a Duchy, this will protect you from another player's Black Cat.<br>- With the 2022 revisions, Lighthouse's phrasing concerning its defense ability has shifted from \"while in play\" to \"until your next turn\". As a result:<br>- If you play a Lighthouse with e.g. Band of Misfits, you will be protected against Attacks until your next turn.<br>- Lighthouse offers no protection during your next turn. This means that on the turn after you play a Lighthouse, you can still get attacked by another player's Black Cat.<br>&nbsp;&nbsp;- This includes getting attacked at the start of your next turn; if you trash a Hunting Grounds with Donate and gain a Duchy, Lighthouse won't protect you from Black Cat."
   },
    {
      "Name": "Lookout",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- You do the things in order - first trash one of the cards, then discard one, then put the last one on top of your deck.<br>- So if there is only one card (even after shuffling), you trash it, and if there are only 2 cards, you trash one then discard the other.<br>- Resolve any on-trash effects of the trashed card before discarding the next card, and resolve any on-discard effects of the discarded card before putting back the last card.<br>- The three cards you look at are not considered to still be the top cards of your deck while you are resolving Lookout. Thus, for example, if you trash a card with an on-trash draw bonus, such as Overgrown Estate, you will not draw one of the remaining two cards you're looking at, but rather the next one down."
   },
    {
      "Name": "Merchant Ship",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- You get +^COIN2^ when you play this and another +^COIN2^ at the start of your next turn."
   },
    {
      "Name": "Native Village",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- When you play this, you either take all of the cards from your mat, or set aside the top card of your deck on your mat.<br>- When you first set aside a card with Native Village, take a Native Village mat to put the cards on.<br>- You can look at the cards on your mat whenever you like, but other players cannot.<br>- You may choose either option even if there are no cards in your deck or no cards on your mat.<br>- You cannot look at the top card before deciding whether to set it aside or take the cards from the mat.<br>- At the end of the game, all cards from the mat are returned to your deck for scoring.<br>- If you choose to place the top card of your deck on the Native Village player mat you may then immediately look at the card, but your choice has been done."
   },
    {
      "Name": "Outpost",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- Outpost has received errata so that you can't take multiple extra turns in a row. Here are rulings that will change as a result.<br>- If you play Outpost multiple times in one turn, you aren't able to take more than 2 turns in a row, so all Outposts after the first will fail.<br>- If you play Outpost on an extra turn, you draw a 3-card hand, and then fail to get a 3rd turn.<br>- If you set up multiple extra turns at once (e.g. one from Outpost, one from Mission), you choose one turn to take, and the others fail.<br>- If you are Possessed, and they make you play Outpost, you draw a 3-card hand, take the Outpost turn, and then take your normal turn.<br>- Outpost only does anything the first time you play it in a turn, and only if the previous turn was another player's (meaning, you are not already taking an extra turn).<br>- If these conditions are met, you take an extra turn, and only draw 3 cards for your next hand rather than 5 (thus usually only having 3 cards in hand on the extra turn).<br>- Except for the smaller starting hand, the extra turn is a normal turn.<br>- If you play e.g. Merchant Ship in the same turn as Outpost, the extra turn will be when you get the +^COIN2^ from Merchant Ship.<br>- Extra turns do not count towards the tiebreaker of which tied player had fewer turns.<br>- Remember that the extra turn is completely normal (if it happens); it is the turn in which you play Outpost which is different, in that you only draw three cards during Clean-up.<br>&nbsp;&nbsp;- This makes Outpost arguably an exception to the basic rule that Duration cards are discarded from play during the Clean-up phase of the last turn on which they \"do something\"; Outpost doesn't do anything on the extra turn it creates other than cause it to happen, but it is not cleaned up until the end of the extra turn regardless. This is because, while you are discarding cards from play during the turn on which you play it, the Outpost still has \"something to do\" (i.e., making you draw only three cards instead of five).<br>- Playing Throne Room (or similar cards) on Outpost will only give 1 extra turn, but the Throne Room will still have to stay out with the Outpost as long as it does.<br>- If an Outpost turn fails (e.g. due to Lich), you discard the Outpost during the next Clean-up that happens (either yours or another player's).<br>- If you gain a Gondola during another player's turn (e.g. from their Barbarian attack) and play an Outpost, you'll take an extra turn after that player's turn (assuming it won't be your 3rd turn in a row), with your current hand. When you draw your hand during that turn's Clean-up, you'll only draw 3 cards.<br>&nbsp;&nbsp;- If they played their own Outpost on the turn that you did this, they'll take their extra turn before you get your extra turn. And if you play another Outpost during their extra turn, you'll take a 2nd extra turn."
   },
    {
      "Name": "Salvager",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- For example if you trash an Estate, which costs ^COIN2^, you get +^COIN2^ (and +1 Buy).<br>- If you trash a card with ^POTION^ or ^DEBT^ in the cost (from other expansions), you get nothing for those symbols."
   },
    {
      "Name": "Smugglers",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- The card has to cost ^COIN6^ or less when you play Smugglers; it does not have to have cost ^COIN6^ or less when the player to your right gained it.<br>- This looks at the most recent turn of the player to your right, even if you have taken multiple turns in a row.<br>- The gained card does not have to have been bought by the other player, just gained; for example you can gain a copy of a card they gained with their own Smugglers.<br>- If they gained multiple cards costing ^COIN6^ or less, you choose between them; if they gained no such cards, you do not gain anything.<br>- This can only gain cards that are present in the Supply; for example you cannot gain a Spoils (from Dominion: Dark Ages).<br>- This is not an Attack, so Lighthouse and Moat do not stop it.<br>- First you choose a card that the player to your right gained costing up to ^COIN6^, and then you (try to) gain a copy of it from the Supply. This means you may be able to choose a card that is unavailable to be gained (e.g., a card whose Supply pile is empty, or a card from outside the Supply); and if you do, you gain nothing.<br>- It doesn't matter where the gained card came from. So if the player to your right gained a card from the trash with Lurker, you can gain a copy of that card (from the Supply).<br>- If your opponent gained a Ruins or a Knight, Smugglers will only let you gain a copy if the top card of the Ruins or Knights pile has the same name.<br>- Cards with ^POTION^ or ^DEBT^ in their cost can never be gained with Smugglers.<br>- If you play this during the player to your right's turn (e.g. they play Barbarian, trash your Gold, and you gain a Gondola that lets you play Smugglers), this checks that player's last completed turn, not their current turn."
   },
    {
      "Name": "Tactician",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- If you have no cards in hand, then Tactician does nothing more and is discarded in the same turn's Clean-up.<br>- If you do have at least one card, you discard your hand, Tactician stays in play, and at the start of your next turn you get +5 Cards, +1 Buy, and +1 Action (and Tactician is discarded that turn).<br>- If you use Throne Room on Tactician, you will discard your hand on the first play and will have no cards in hand for the second play (and so will not get the bonuses from it).<br>- You can Throne Room a Tactician, but (under ordinary circumstances) you do not get any extra cards (as described above). Still the Throne Room (or its variants) stays in play.<br>- Like all Duration cards, Tactician only stays in play during your Clean-up phase if it will do something in a future turn. So, if you play Tactician but do not discard any cards, it will have no effect on your next turn and should be discarded during the same turn's Clean-up phase.<br>- When the +1 Card token is on Tactician, using a Throne Room variant on it becomes meaningful as it provides you a card to discard each time Tactician is played again."
   },
    {
      "Name": "Treasure Map",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- When you play this, you trash it and trash another Treasure Map from your hand, if you can.<br>- If you did trash another copy of Treasure Map, then you gain 4 Golds, putting them onto your deck instead of your discard pile.<br>- If you did not have another copy of Treasure Map in hand, then you just trash the played Treasure Map and nothing else happens.<br>- Using Throne Room on Treasure Map is not trashing two Treasure Maps.<br>- If you play a Command variant such as Band of Misfits, which then plays a Treasure Map, you can't trash the Treasure Map from the Supply, so you will fail to gain 4 Golds.<br>&nbsp;&nbsp;- You gain the Golds if you play the early versions of cards like Band of Misfits as Treasure Map.<br>- If you Possess someone and make them trash 2 Treasure Maps, both of them are set aside, and you gain 4 Golds to your discard pile.<br>- Both Treasure Maps have to be trashed at once. This means that if you draw the second Treasure Map as a result of trashing the first one (e.g. by trashing a Cultist to Sewers), you can't trash the second Treasure Map for 4 Golds."
   },
    {
      "Name": "Treasury",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- If you didn't gain any Victory cards during your Buy phase, you may put any or all of your played Treasuries on top of your deck at the end of it.<br>- If you did gain at least one Victory card, all of the Treasuries are discarded normally.<br>- Victory cards gained outside of the Buy phase, such as with Smugglers, don't prevent you from putting Treasuries on your deck.<br>- In 2022, Treasury was reworded, which changed its topdecking condition from not buying a Victory card to not gaining a Victory card in your Buy phase.<br>- Returning from your Buy phase to your Action phase (e.g. with Villa or Cavalry) counts as ending your Buy phase, [1] which will let you put Treasury onto your deck. You can potentially do this multiple times a turn.<br>- If you gain a Cavalry, you get the +2 Cards before you get to put Treasury onto your deck."
   },
    {
      "Name": "Warehouse",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside",
      "FAQ": "- If there are fewer than 3 cards for you to draw (after shuffling), you still discard 3 cards."
   },
    {
      "Name": "Wharf",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside",
      "FAQ": "- You draw 2 cards and get +1 Buy when you play this, and draw another 2 Cards and get +1 Buy at the start of your next turn."
   },
    {
      "Name": "Ambassador",
      "Cost": "3",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- First you reveal a card from your hand.<br>- Then take 0, 1, or 2 copies of that card from your hand and put them on top of their Supply pile.<br>- Then each other player gains a copy of that card from the Supply.<br>- If there are not enough copies to go around, deal them out in turn order, starting with the player to your left.<br>- If you reveal a card which is not from the Supply, such as Spoils, Madman, Mercenary, or Shelters, Ambassador does nothing. Similarly, because none of the cards bought through Black Market are in the Supply, if you reveal a card bought through Black Market, Ambassador does nothing.<br>- If you reveal a card which is part of a Supply pile with differently named cards, such as Ruins or Knights, you can only return two cards to the supply pile if they have the same name. Other players will only gain cards with that name, and only if they are on the top of the deck (no digging).<br>- If you empty either the Province pile or a third Supply pile, then use Ambassador so that the pile is no longer empty at the end of your turn, the game does not end.<br>- If you return the bottom card of a Split pile when there is a top card on top, you still put the returned bottom card on top, not under the remaining top cards."
   },
    {
      "Name": "Embargo",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- The token can go on any Supply pile - a Kingdom card pile such as Embargo, or a base card pile such as Silver.<br>- The token modifies the pile, so that anyone buying a card from that pile gains a Curse.<br>- This even affects the player who placed the Embargo token.<br>- This is cumulative; with three Embargo tokens on a pile, buying a card from that pile will give you three Curses.<br>- Embargo tokens do not do anything if a card is gained without being bought, such as with Smugglers, or if the Curse pile is empty.<br>- Embargo tokens are not counter-limited; use a replacement if necessary.<br>- If you Throne Room Embargo, you will get +^COIN4^ but only place one token, since you can only trash Embargo once.<br>- If there are multiple Embargo tokens on a pile, each Curse gain from buying from that pile happens separately, which allows other when-buy triggers (such as the pre-errata version of Haggler's) to activate in between Curse gains."
   },
    {
      "Name": "Explorer",
      "Cost": "5",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- You do not have to reveal a Province if you have one.<br>- If you do reveal one you gain a Gold, otherwise you gain a Silver.<br>- The gained card comes from the Supply and is put into your hand; it can be played the same turn."
   },
    {
      "Name": "Ghost Ship",
      "Cost": "5",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- Each other player keeps putting cards from their hand onto their deck, in any order they choose, until they only have 3 cards in hand.<br>- Players who already had 3 or fewer cards in hand do not put any cards onto their deck."
   },
    {
      "Name": "Navigator",
      "Cost": "4",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- You discard all 5 cards (or however many were left after shuffling) or none of them.<br>- If you do not discard them, put them back in any order."
   },
    {
      "Name": "Pearl Diver",
      "Cost": "2",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- First draw a card and get +1 Action; then look at the bottom card of your deck, shuffling first if needed.<br>- If you choose to put the bottom card on top of your deck, be sure not to look at the card above it."
   },
    {
      "Name": "Pirate Ship",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- Players revealing a card like Moat do so before you choose your option.<br>- If you choose the first option, you get +^COIN1^ per Coin token on your Pirate Ship mat; the Coin tokens stay there.<br>- If you choose the second option, each other player reveals the top 2 cards of their deck, trashes a revealed Treasure of your choice, if possible, and discards the rest of their revealed cards.<br>- Then, if any players did trash a Treasure, you add a Coin token to your Pirate Ship mat (from the supply of tokens).<br>- You get at most one Coin token per play of Pirate Ship.<br>- Take a Pirate Ship mat when you first need one.<br>- Coin tokens on your Pirate Ship mat cannot be spent (as the Coin tokens from Dominion: Guilds can be)."
   },
    {
      "Name": "Sea Hag",
      "Cost": "4",
      "Type": [
         "Action",
         "Attack"
      ],
      "Expansion": "Seaside, 1E",
      "FAQ": "- The Curses are given out in turn order, which can matter when the Curse pile is low.<br>- They go onto decks rather than into discard piles.<br>- Even when there are no Curses left, other players still discard the top card of their deck when Sea Hag is played."
   },
    {
      "Name": "Astrolabe",
      "Cost": "3",
      "Type": [
         "Treasure",
         "Duration"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- This gives you +1 Buy and +^COIN1^ on the turn you play it, and +1 Buy and +^COIN1^ on your next turn too."
   },
    {
      "Name": "Blockade",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- The gained card comes from the Supply and is set aside; put it on the Blockade to remember which card goes with Blockade.<br>- If the gained card somehow doesn't end up set aside (for example if you trash it with Watchtower from Prosperity), nothing further happens; if the card is set aside, then you put it into your hand on your next turn, and until then, when other players gain the card on their own turns, they also gain a Curse.<br>- Like all Duration Attacks, you have to reveal your Moat as soon as another player plays a Blockade.<br>- The card you gain is immediately set aside, and doesn't visit your discard pile. So if you gain a Nomad Camp or Ghost Town, their abilities won't trigger.<br>- If a card moves itself when you gain it (e.g. Berserker or Villa), Blockade will fail to keep that card set aside for your next turn.<br>- If Blockade fails to keep its gained card set aside (because it got moved away), you'll discard the Blockade from play during Clean-up.<br>- This only Curses another player if they gain a copy of a Blockaded card during their own turn. If you make them gain a copy of that card when it's not their turn (e.g. you give them a copy with Messenger), they won't gain a Curse.<br>- If you gain a Curse with Blockade, then when another player gains a Curse on their turn (e.g. by buying Desperation), they will gain all Curses in the Supply.<br>&nbsp;&nbsp;- If they have a Trader in hand, they can exchange any number of those Curses for Silvers, but they'll still have to gain all the Curses.<br>- During a Possession turn, no one will get Cursed from Blockade."
   },
    {
      "Name": "Corsair",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- The trashed Silver or Gold still made ^COIN^ for the player to spend that turn.<br>- If you're under multiple Corsair attacks, you'll only trash one card, whether it is a Silver or a Gold."
   },
    {
      "Name": "Monkey",
      "Cost": "3",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- This includes cards that the player gains on other players' turns, such as a Curse they gain on your turn via Witch.<br>- When the player to your right gains a card, if it's their turn, they resolve any of their on-gain effects before you draw a card.<br>&nbsp;&nbsp;- If they gain an Attack card to make you discard to their Skirmisher, you'll first discard down to 3 cards, and then you'll draw a card from Monkey.<br>&nbsp;&nbsp;- If they gain a Berserker and play it, you'll draw a card (from the cheaper card that their Berserker gains); then you'll discard down to 3 cards; then you'll draw another card (from the initial Berserker gain).<br>- If your Monkey draws a Reaction that can react to the card they gained (e.g. they gained a Treasure and you draw a Pirate), you can immediately use it.<br>- If the player to your right gains a Province, you can trash a Fool's Gold from your hand, and then draw the gained Gold with Monkey.<br>- If you play this with Way of the Chameleon, you get +^COIN1^ when the player to your right gains a card during your turn. Afterwards, you'll get +1 Card when that player gains a card, and +1 Card at the start of your next turn.<br>- The duration effect ends instantaneously when your next turn starts. So if another player gains a card at the start of your turn (e.g. you play a Witch with Prepare), Monkey won't draw you a card from that."
   },
    {
      "Name": "Pirate",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Reaction"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- You can play this when you gain a Treasure, or when another player gains a Treasure.<br>- If you play this during another player's turn, your following turn is when your Pirate gains you a Treasure.<br>- The Treasure you gain comes from the Supply and goes directly to your hand.<br>- This plays like the Reactions in Menagerie; see the Reactions section.<br>- If you have Capitalism, gaining an Action with +^COIN^ in its text will let all players play Pirates from their hand."
   },
    {
      "Name": "Sailor",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- If you gain a Duration card the turn you play Sailor, playing it is optional.<br>- This is cumulative; if you play two Sailors, you can play up to two gained Duration cards. However two Sailors cannot play the same gained Duration card twice.<br>- Sailor applies to cards gained due to being bought, or gained other ways, such as with Workshop.<br>- If you gain a Duration card in your Buy phase, Sailor can play it, even though it's your Buy phase. If such a card gives you +Actions, that doesn't let you play more Action cards in your Buy phase; if it draws Treasure cards, you can only play them if you haven't bought any cards yet.<br>- The ability to play Duration cards only happens the turn you play Sailor; on your next turn, you just get +^COIN2^ and may trash a card from your hand.<br>- The Duration doesn't need to be an Action, meaning that you can play Night-Durations when you gain them (like Cobbler).<br>- If you exchange a Hero for a Champion, you aren't gaining it, so you can't play it.<br>- If you gain a Garrison and play it, you'll immediately add a token to Garrison.<br>- This can play a gained Duration even if it was gained to somewhere other than your discard pile (such as a Guardian, or a card gained with Blockade), or if another card is trying to move it at the same time (such as Gatekeeper). But if the gained card has already gotten moved (e.g. by another Sailor), then this can't play it."
   },
    {
      "Name": "Sea Chart",
      "Cost": "3",
      "Type": [
         "Action"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- If you have a copy of the revealed card in play - including the just played Sea Chart, or a Duration card that you have in play from a previous turn - then you put the revealed card into your hand; otherwise, you leave the card on top of your deck."
   },
    {
      "Name": "Sea Witch",
      "Cost": "5",
      "Type": [
         "Action",
         "Duration",
         "Attack"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- When you play this, you draw 2 cards and each other player gains a Curse; then at the start of your next turn, you draw 2 cards and then discard 2 cards."
   },
    {
      "Name": "Tide Pools",
      "Cost": "4",
      "Type": [
         "Action",
         "Duration"
      ],
      "Expansion": "Seaside, 2E",
      "FAQ": "- When you play this, you get +3 Cards and +1 Action, but at the start of your next turn, you have to discard 2 cards.<br>- If you have only one card left in hand you discard that one, and if you have no cards you don't discard any.<br>- When you have multiple Duration cards doing things at the start of your turn, you can put them in an order to your advantage; for example if you have four Tide Pools and a Wharf, you could discard all of your cards to the Tide Pools, then draw the Wharf cards."
   }
   ]
