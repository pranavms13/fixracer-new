import logo from './logo.svg';
import './App.css';

import Web3 from "web3";

import abi from './contract.json';
import tokenlist from './tokenlist.json';

function App() {


  const [nft, setnft] = useState({});
  const [address, setaddress] = useState('');
  const [burnsuccesslist, setburnsuccesslist] = useState([]);
  const [mintsuccesslist, setmintsuccesslist] = useState([]);

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

  const burnnft = async () => {
    try {
      let successtx = []
      let i = 0;
      while (i < tokenlist.length) {
        let tok = tokenlist[i];
        await nft.methods.safeBurn(tok.tokenID).send({ from: address }).on('transactionHash', (hash) => {
          //success burn
          console.log(`${tok.tokenId} is burned`);
          successtx.push(tok.tokenId);
        })
        i++;
      }
      setburnsuccesslist(successtx);
    }
    catch (err) {
      console.log(err);
    }
  }

  const mintnft = async () => {
    try {
      let successtx = []
      let i = 0;
      while (i < tokenlist.length) {
        let tok = tokenlist[i];
        await nft.methods.safeMint(tok.seller, tok.tokenId).send({ from: address }).on('transactionHash', (hash) => {
          //success mint
          console.log(`${tok.tokenId} is minted`);
          successtx.push(tok.tokenId);
        })
        i++;
      }
      setmintsuccesslist(successtx);
    }
    catch (err) {
      console.log(err);
    }
  }

  

  return (
    <div className="App">
    <div>
    <button onClick={() => { burnnft() }} style={{ marginLeft: "10px" }}>
        burn
      </button>
      <hr/>
      Tokens burned:
      {
        burnsuccesslist.map((item, index) => {
          return <div key={index}>{item}</div>
        })
      }
    </div>
    <br/>
    <div>
    <button onClick={() => { mintnft() }} style={{ marginLeft: "10px" }}>
        mint
      </button>
      <hr/>
      Tokens minted:
      {
        mintsuccesslist.map((item, index) => {
          return <div key={index}>{item}</div>
        })
      }
    </div>
      
    </div>
  );
}

export default App;
