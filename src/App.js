import logo from './logo.svg';
import './App.css';

import Web3 from "web3";

import abi from './contract.json';
import tokenlist from './tokenlist.json';

function App() {

  const [nft, setnft] = useState({});
  const [address, setaddress] = useState('');
  const [successlist, setsuccesslist] = useState([]);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);


  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    // const web3 = useWeb3React();
    if (typeof window.ethereum == "undefined") return;

    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);

    const Accounts = await web3.eth.getAccounts();

    if (Accounts.length == 0) {
      return;
    }
    setaddress(Accounts[0]);
    const networkId = await web3.eth.net.getId();

    // const hell = Helloabi.networks[networkId];
    if (networkId == 137) {
      alert("you are connected to polygon")
      const contract = new web3.eth.Contract(abi, "0xc96D83080F535c255771d456E2f59AB55758599f");
      setnft(contract);
    }
    else {
      alert("connect to polygon and refresh")
    }
  }

  const burnmint = async () => {
    try {
      let successtx = []
      for (let i = 0; i < tokenlist.length; i++) {
        let tok = tokenlist[i];
        nft.methods.safeBurn(tok.tokenID).send({ from: address }).on('transactionHash', (hash) => {
          //success burn
          nft.methods.safeMint(tok.seller, tok.tokenId).send({ from: address }).on('transactionHash', (hash) => {
            //success mint
            console.log(`${tok.tokenId} is burned and minted`);
            successtx.push(tok.tokenId);
          })
        })
      }
      setsuccesslist(successtx);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <button onClick={() => { burnmint() }} style={{ marginLeft: "10px" }}>
        burnandmint
      </button>
      <hr/>
      Tokens burned and minted:
      {
        successlist.map((item, index) => {
          return <div key={index}>{item}</div>
        })
      }
    </div>
  );
}

export default App;