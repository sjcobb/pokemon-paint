/* http://www.musictheory.net/lessons/10 */

var staff = { 
    ledger-e: { whole-note1: bulbasaur, whole-note2: ivysaur, whole-note3: venusaur }, 
    ledger-g: { whole-note1: charmander, whole-note2: charmeleon, whole-note3: charizard }, 
    ledger-b: { whole-note1: squirtle, whole-note2: wartortle, whole-note3: blastoise },
    ledger-d: { whole-note1: pidgey, whole-note2: pidgeotto, whole-note3: pidgeot },
    ledger-f: { whole-note1: oddish, whole-note2: gloom, whole-note3: vileplume } 
}

console.log( staff[ 'ledger-e' ][ 'whole-note2' ] );
