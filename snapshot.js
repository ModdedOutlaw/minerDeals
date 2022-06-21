async function fetchOpenProposalsJSON() {
    const response = await fetch('https://hub.snapshot.org/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: `query {
            proposals (
              first: 20,
              skip: 0,
              where: {
                space_in: ["theuplift.eth"],
                state: "open"
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              scores
              scores_by_strategy
              scores_total
              scores_updated
              author
              space {
                id
                name
              }
            }
          }`,
          variables: {
            type: 'post'
          }
        }),
        headers: {
            'content-type': 'application/json'
        }
      });

      const proposals = await response.json();

      return proposals;
      
}


async function fetchSpaceJSON() {
  const response = await fetch('https://hub.snapshot.org/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
        query {
          space(id: "theuplift.eth") {
            id
            name
            about
            network
            symbol
            members
          }
        }`,
        variables: {
          type: 'post'
        }
      }),
      headers: {
          'content-type': 'application/json'
      }
    });

    const space = await response.json();

    return space;
    
}



async function getActiveProposals(){

    await fetchOpenProposalsJSON().then(open_proposals => {

        open_proposals.data.proposals.forEach((element, index) => {
    
           console.log(element);
    
        });
    });

}


async function getSpaceInfo(){

  await fetchSpaceJSON().then(space_info => {
    console.log(space_info);
      
  });

}

getActiveProposals();
getSpaceInfo();
