import { createMachine } from "xstate";

export const showMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcxgHawHQGUUB7DAYnwGEB5AJQFEB9ASQDkL6BBfOgEQG0ADAF1EoAA5FYASwAuUollEgAHogC0ANgDMAJlwCAnAEYdRrQHYAHAPM2ANCACeiHTdyXrlgxrMBWACz+Wv4aAL6hDqgY2Hg8YDIAhlIANpCEJGCkAGKsTPgAEgw8dAAqHEwAMryCIkggEtJyCkqqCJq4RrYmlv5G-qYClloaDs4IvuYdGtPTvq6+GqZhESBRmDi4cYkpacRkOSx5hcVlldVGteKSsvKKda1GGgK4-t4BOpZGljqmvqPqBi0uC0IJB-gmcyWRnCkXQ61i8SSqQg6TIlFojFY7DoXGqwiUDRuzXu6kelncw3MBgMvgsAg0-ksfycpK0zxm03MPm04MBMNWcJiuAA6lIsFgwGhsrkCgxhawWHQaDUCdcmndQK01LT-MCjBM2ZZFoEDJZ-m0jB0PkMNJ9pt8bJ9wissEQIHAlGsYqrGrcWupLFZ9MZTBZrLZzOa1FpfAZcIDbN9-I6ftp+V6NqiwD6iRqVAG2cGTGYrDZ7Cy2jpzHogomzDoDcb04KNlskbsMjn1f6LSDcL5fAJQVXzAsfloo2YrR4ydoPlojMZm9ENqLxZKu36SW05kDAwJeuCh4ujebvPp-KOfEeGcFzM7QkA */
  createMachine({
    id: "screens",
    initial: "Score",
    predictableActionArguments: true,
    states: {
      Score: {
        on: {
          SCORE_INCREASED: {
            actions: ["showScore", "trackTheStartingOfAnimation"],
            target: "DetailedScore",
          },
        },
      },
      DetailedScore: {
        on: {
          FINISH_DETAILED: [
            {
              cond: "hasWinner",
              target: "Winner",
            },
            {
              target: "Score",
              actions: ["trackTheEndingOfAnimation"],
            },
          ],
          SCORE_INCREASED: {
            target: "DetailedScore",
            internal: false,
          },
        },
      },
      Winner: {
        on: {
          FINISH_WINNER: {
            target: "Score",
            actions: ["trackTheEndingOfAnimation"],
          },
        },
      },
    },
  });
