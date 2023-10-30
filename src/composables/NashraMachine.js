import { createMachine } from "xstate";

export const NashraMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDkCGsAWAnVBZVAxhgJYB2YAdLAQPZaVikAuYWAyrfQIKnEC2qJsRqkAxAA9YTQZVQAzFlgAUAUWQAVFQCUA+mwDCAeS0qdXZAElcXdRcPIdAERUAZLgE0AlKLSYc+IjJKajoGZlYOUJ5+QWFSAG0ABgBdRFAABxpYYiERNJBxRABaACYAVgB2CgBOMoBmAEZygBoQAE9EapLEigAOBoqK3orqhoa6uoA2AF9p1t9sPEIScipOYPX9Gj500QNjUwtkfRMuNhVHJNSkEEzs3NJ8woRS8YoSksn63onh3uqACytDoIMZ1Ep9AZDEZgqazeboRYBFYbUIUAA2YFQADcwJFuLwBA8JFIZBR5IolC4VFwAGqmfYmMyWay2exOVwebwLfzLIJrNGYnF49bRIlxK75O45OJPTpNGq-OqJRofSYVErAxBNBq9SFDcFlMq9RKTaq9eEgHlLQKrCBgaTETEQfFhRSOB2oJ2QV1i2IiEnSFjkhSsVQabQc9RcCzUxx6IxM8xWGx2BzONxeHyI3m2yj2x3O10URjuz3el2iwn+hIpKVZGV5G7PP4UeplAElCp1WqJBqTOpahAjKpldXQkoAoZfaqW63I-kFr1F9YUJcV11bHaBskUsPOaOxi4Jg4czPcnM2lFr8srtHru-0LfpSU3aUPOUIQENGom7sA8Zqi+RJNXaToKjKNtx2GSdpzKWc5itS8FztW8fVXIVcQ9Qt0KiatiUkINZFDZRqTpUwDxjOMTyTFlU3ZDMuWzPwr0XNDK0FLEsPY318IlOs3wbD9m0QD46goSZxjKAYOwaao6gqAFeiHBpEmqHpTSGRIym6AEpgBOdkL5VCcI4+gMS4sBsOXXCCRiAjSWDPdSJpekoyo49GVMZNWTTM8mPnYz8x4jDLOsjcq3siUGmuDIhNlESEA+ap3kGSTPgqSYpx0ocuh6fpBkUsdJhKXVDJYlDKAAdzIXhSCgEtwiwAB1WqyCgP0HKIkNKTUTRdGao5LGQABxZkUzZdNOSzQK8woGrSDqhrS1YVrFvazr+Ni254qbUAWyUigAS+JppO7JpjpUqcUuOxIII+cpMvk8qkSC+a2vq971vq58dyckilEG5BhrGxiZqMuaFqWr6lufV84vuBL9s6U0KDu-oWjA0FJjuo6cfuj5KjNOoXtza8ofaizhTWpbNoDQjdwBsi3KBkHxt8hjpovCq3opz7MLAGmNr4kR4Z2xG9oKYpPhSoZTrqeoGinOplKx-s5Lxu6dMJp6SctUgaHteAblmlF6wlx5EqKBXxNqVUyiHDsejHQYYKnXoZ1J1jVhCehzcbS3kZeZVILt06hyK-VFNKuoASA-4vcqgVzJW9hIvFSX3yRqWXl1PUHaxn5xMaV2YXGOFENN-lfdRJ9tnSf3hKDopdQaFS+yqAroVGcuZkriHrxrqncV4qLM92wOc9eSYKHBFUSgU7SuiyyYVNKqoS+72E+4RHm5ofWywEb7OW2VNsFc7bte37QcsZKvVNInd3Pf7vfrwPsy3VYcLHzAOnJ6zpLZ46keglHkgvTKmVsoRwaJBF2T84IIV3q9feIV7xoLrjsY+QDOhZXeOAhS6osoQSHMMGej83aIMTm9D+xYBY-0Pv-bBk9gGJD1GA8EhCoEkLVmw-O0ENTPx3khN+-I+ZQGYZ+E0PRjrSXKAMVUl01bgh-EBLWD0ibPVfig8mH1lpNSFvVJhgkLZSMqFdNSmsCaPWJtQyGeiYbtWfJIxK8keg6htsdTsWVqgqVkjUfG2sbFaOQWTMRDiBaGI6iLABE8pG9D1L0Eo-RtITDkl2FSkxJh6lutYzRetZhAA */
    id: "NashraMachine",
    initial: "score",
    predictableActionArguments: true,
    states: {
        score: {
            id: "scoreMachine",
            initial: "enterScoreAnimation",

            states: {
                enterScoreAnimation: {
                    on: {
                        ANIMATION_ENDED: { target: "scoreComp" }
                    },
                },
                scoreComp: {
                    entry: ["updateAnimationStateToEnd"],
                    on: {
                        SCORE_INCREASED: {
                            target: 'leaveScoreAnimation'
                        }
                    },
                    exit: ["updateAnimationStateToStart"]
                },
                leaveScoreAnimation: {
                    on: {
                        ANIMATION_ENDED: {
                            target: "#NashraMachine.detailedScore"
                        }
                    }
                }
            }
        },

        detailedScore: {
            id: "detailedScoreMachine",
            initial: "enterDetailedScoreAnimation",
            states: {
                enterDetailedScoreAnimation: {
                    on: {
                        ANIMATION_ENDED: {
                            target: "detailedScoreComp"
                        }
                    }
                },
                detailedScoreComp: {
                    after: {
                        DETAILED_SCORE_DELAY: {
                            target: "leaveDetailedScoreAnimation"
                        }
                    }
                   
                },
                leaveDetailedScoreAnimation: {
                    on: {
                        ANIMATION_ENDED: [{
                            target: "#NashraMachine.winning", cond: 'winnerCond'
                        }, {
                            target: "#NashraMachine.score"
                        }]
                    }
                }
            }
        },

        winning: {
            id: "winningMachine",
            initial: "enterWinningAnimation",
            states: {
                enterWinningAnimation: {
                    on: {
                        ANIMATION_ENDED: {
                            target: "winningComp"
                        }
                    }
                },
                winningComp: {
                    after: {
                        WINNING_DELAY: {
                            target: "leaveWinningAnimation"
                        }
                    }
                },
                leaveWinningAnimation: {
                    on: {
                        ANIMATION_ENDED: {
                            target: "#NashraMachine.score"
                        }
                    }
                }
            }
        }
    }
}, {
    delays: {
        DETAILED_SCORE_DELAY: 3000,
        WINNING_DELAY: 1000,
    },
    guards: {
        winnerCond: (ctx, event) => {
            return event.winner
        }
    },
    actions: {
        updateAnimationStateToStart: async (ctx, event) => {
            await event.startAnimate();
        },
        updateAnimationStateToEnd: async (ctx, event) => {
            await event.endAnimate();
        }
    },
})

