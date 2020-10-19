import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box,TextField, Link, Typography, Card, CardContent, Grid, CircularProgress } from '@material-ui/core'
import {ApiPromise, WsProvider } from '@polkadot/api'

function thousands_separators(num){
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

const useStyles = makeStyles(theme => ({
    root: {
    minWidth: 500,
    margin: theme.spacing(6),
  },    
  search: {
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(10),
  },
}))
const wsProvider = new WsProvider('wss://rpc.polkadot.io')

export default () => {
  const classes = useStyles()
  const [latestBloakHeader, setLatestBlockHeader] = React.useState({})
  const [search, setSearch] = React.useState('')
  const [block, setBlock] = React.useState()
  React.useEffect(() =>{
      ApiPromise.create({ provider: wsProvider })
          .then(api =>{
              global.polkadot_api = api
              api.rpc.chain.subscribeNewHeads((header) => {
                setLatestBlockHeader(header)
              })
          })

  }, [])
  const handleKeyDown = e =>{
      if (e.key === 'Enter') {
        setBlock(null)
        global.polkadot_api.rpc.chain.getBlock(search)
            .then(block =>{
                setBlock(block)
            })
    }
  }

  return <>
    <div>
      <Box display="flex"> 
      <Box m="auto">
          <Typography variant="h3" component="h3" color="secondary" >
            Polkadot explorer
          </Typography>
        </Box>
      </Box>
 
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.search} >
           <TextField
            fullWidth
            label="block hash"
            variant="outlined"
            color="secondary"
            onKeyDown={handleKeyDown}
            onChange={event => setSearch(event.target.value)}
          />
        </Grid>
      </Grid>
   {block && <Card className={classes.root} variant="outlined">
         <CardContent>
               <Typography variant="h6" >
                 search block number:  <span style={{marginLeft: 10}} 
                   >#{thousands_separators(block.block.header.number)}</span>
               </Typography>
               <Typography >
                 search block hash: 
                 <Link 
                     color = "secondary"
                     target="_blank"
                     href={`https://polkascan.io/polkadot/block/${block.block.header.number}`}>
                 <span style={{marginLeft: 10}}>{block.block.header.hash.toHex()}</span>
                 </Link>
               </Typography>
         </CardContent>
    </Card>}
    <Card className={classes.root} variant="outlined">
      <CardContent>
            <Typography variant="h6" >
              latest block number:  {latestBloakHeader.number ? 
                <span style={{marginLeft: 10}} 
                >#{thousands_separators(latestBloakHeader.number.toNumber())}</span>:
                <CircularProgress size={18} style={{marginLeft: 20, marginTop: 6}}  />
              }
            </Typography>
            <Typography >
              latest block hash: {latestBloakHeader.hash ? 
                  <Link 
                    color = "secondary"
                    target="_blank"
                    href={`https://polkascan.io/polkadot/block/${latestBloakHeader.number.toNumber()}`}>
                <span style={{marginLeft: 10}}>{latestBloakHeader.hash.toString()}</span></Link>:
                <CircularProgress size={18}  style={{marginLeft: 20, marginTop: 6}} />
              }
            </Typography>
      </CardContent>
    </Card>


    </div>
  </>
}