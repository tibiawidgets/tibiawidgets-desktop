// eslint-disable
export default () => {
  const e = e=>{
      const t = document.createElement("input");
      t.value = e,
      t.focus(),
      document.body.append(t),
      t.select(),
      document.execCommand("copy"),
      t.remove()
  }
    , t = e=>Number(e.replace(/,/g, ""))
    , a = new Intl.NumberFormat("en")
    , o = e=>a.format(e)
    , n = e=>{
      const {totalBalance: a, balancePerPerson: o, people: n} = (e=>{
          e = e.trim();
          const a = t(e.match(/Balance:? (?<balance>[\d,-]+)/).groups.balance)
            , o = new Map
            , n = e.matchAll(/(?<name>[-a-zA-Z' \(\)]+)\n\s+Loot:? [\d,-]+\n\s+Supplies:? [\d,-]+\n\s+Balance:? (?<balance>[\d,-]+)/g);
          for (const e of n) {
              const a = e.groups.name.replace(" (Leader)", "")
                , n = t(e.groups.balance);
              o.set(a, n)
          }
          return {
              totalBalance: a,
              balancePerPerson: Math.floor(a / o.size),
              people: o
          }
      }
      )(e)
        , {givers: r, receivers: c} = (({people: e, balancePerPerson: t})=>{
          const a = new Set
            , o = new Set;
          for (const [n,r] of e) {
              const e = {
                  name: n,
                  amount: Math.abs(r - t)
              };
              r > t ? a.add(e) : o.add(e)
          }
          return {
              givers: a,
              receivers: o
          }
      }
      )({
          people: n,
          balancePerPerson: o
      })
        , s = (({givers: e, receivers: t})=>{
          const a = [];
          e: for (const o of e)
              for (const n of t) {
                  if (!(n.amount <= o.amount)) {
                      a.push({
                          from: o.name,
                          to: n.name,
                          amount: o.amount
                      }),
                      n.amount -= o.amount,
                      e.delete(o);
                      continue e
                  }
                  a.push({
                      from: o.name,
                      to: n.name,
                      amount: n.amount
                  }),
                  o.amount -= n.amount,
                  t.delete(n)
              }
          return a
      }
      )({
          givers: r,
          receivers: c
      });
      return {
          totalBalance: a,
          numberOfPeople: n.size,
          balancePerPerson: o,
          transactions: s
      }
  }
    , r = document.querySelector("#party-loot-input")
    , c = document.querySelector("#party-loot-output");
   r.addEventListener("input", ()=>{
      try {
          const {totalBalance: e, numberOfPeople: t, balancePerPerson: a, transactions: s} = n(r.value)
            , l = [];
          for (const {from: e, to: t, amount: a} of s)
              l.push(`<li data-copy="transfer ${a} to ${t}" title="Click to copy bank NPC transfer text">${e} should pay <b>${o(a)} gp</b> to ${t}.`);
          l.push(`<li>Total balance: <b>${o(e)} gp</b>`),
          l.push(`<li>Number of people: <b>${o(t)}</b>`),
          l.push(`<li>Balance per person: <b>${o(a)} gp</b>`);
          const u = `<ul>${l.join("")}</ul>`;
          r.classList.remove("error"),
          c.innerHTML = u
      } catch {
          r.classList.add("error"),
          c.innerHTML = "Error: failed to parse input. Please go to the Tibia client, copy the output from the in-game “party hunt analyser”, and paste it into the input field."
      }
  }
  ),
  c.addEventListener("click", t=>{
      const a = t.target;
      a.matches("li[data-copy] b") ? e(a.parentElement.dataset.copy) : a.matches("li[data-copy]") && e(a.dataset.copy)
  }
  )
}
// eslint-enable
