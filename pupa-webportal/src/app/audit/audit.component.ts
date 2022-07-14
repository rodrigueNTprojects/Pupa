import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import * as Viewer from 'bpmn-js/lib/Viewer';

/////////////////// Start ///////////////////////
import { Observable } from 'rxjs/Observable';
import { element } from 'protractor';
import { ProcessStorage } from '../data-store/data-store';
/////////////////// End /////////////////////////

declare function require(name: string);
const jQuery = require('jquery');

@Component({
  selector: 'audit',
  styleUrls: ['./audit.component.css'],
  templateUrl: "./audit.component.html"
})
export class AuditComponent {
  toSearch = '';
  rootProcess = '';
  policyId = '';
  registryAddress = '';

  transactionID = '';

  processID = '';
  stepsProc = [];

  bindingPolicy = '';

  nominatorRole = '';
  nomineeRole = '';
  procesCase = '';

  nominatorNAddress = '';
  nomineeNAddress = '';

  endorserRole = '';
  endorserAddress = '';

  nominatorRAddress = '';
  onNomination = "true";
  isAccepted = "true";

  roleState = 'UNDEFINED';
  pCaseQuery = '';
  roleToQuery = '';
  caseCreator = '';
  caseCreatorRole = '';

  ///////////////////// Start //////////////////////////

  connection;
  message;

  // Added stuff here
  displayedColumns: string[] = ['name', 'occupation', 'age'];
  //dataSource: any = USER_DATA;

  //private sURL = 'http://localhost:8090';
  //private socket;

  ////////////////////// End /////////////////////////

  constructor(private router: Router, private http: Http, private processStorage: ProcessStorage) {
     const instances = processStorage.getInstance(processStorage.modelId);     
     
  }

  // loadModel() {
  //   if (this.url !== 'No Contracts Available' && this.url !== '') {
  //     this.http.get(this.url)
  //       .subscribe(resp =>
  //         this.viewer.importXML(resp.json().bpmn, (definitions) => {
  //           this.renderState(resp.json());
  //         })
  //       );
  //   }
  // }

  goToDashborad() {
      this.router.navigateByUrl('/dashboard');
  }

  findRoleState() {
    let errorM = '';
    errorM = this.checkEmpty(this.pCaseQuery, '[Role] ');
    if(errorM !== '') {
      alert('Error: ' + errorM + 'cannot be empty');
      errorM = '';
    } else {
       this.processStorage.findRoleState(this.roleToQuery, this.pCaseQuery);
       this.roleState = this.processStorage.roleState;
    }
  }

  checkEmpty(input, text) {
    return input == '' ? text : ''; 
  }

  createInstance(pId) {
    let errorM = this.checkEmpty(this.caseCreator, '[Case Creator Address] ');
    if(errorM !== '') {
      alert('Error: ' + errorM + 'cannot be empty');
      errorM = '';
    } else {
      this.processStorage.createInstance(pId, this.caseCreator, this.caseCreatorRole);
    }
  }

  nominate() {
    let errorM = '';
    errorM = this.checkEmpty(this.nominatorRole, '[Nominator Role] ') + 
             this.checkEmpty(this.nomineeRole, '[Nominee Role] ') +
             this.checkEmpty(this.procesCase, '[Process Case] ') +
             this.checkEmpty(this.nominatorNAddress, '[Nominator Address] ') +
             this.checkEmpty(this.nomineeNAddress, '[Nominee Address] ');
    if(errorM !== '') {
      alert('Error: ' + errorM + 'cannot be empty');
      errorM = '';
    } else {
      console.log(this.nominatorRole);
      this.processStorage.nominate(this.nominatorRole, this.nomineeRole, this.nominatorNAddress, this.nomineeNAddress, this.procesCase);
    }
  }

  release() {
    let errorM = '';
    errorM = this.checkEmpty(this.nominatorRole, '[Nominator Role] ') + 
             this.checkEmpty(this.nomineeRole, '[Nominee Role] ') +
             this.checkEmpty(this.procesCase, '[Process Case] ') +
             this.checkEmpty(this.nominatorRAddress, '[Nominator Address] ');

    if(errorM !== '') {
      alert('Error: ' + errorM + 'cannot be empty');
      errorM = '';
    } else {
      this.processStorage.release(this.nominatorRole, this.nomineeRole, this.nominatorRAddress, this.procesCase);
    }
  }

  vote() {
    let errorM = '';
    errorM = this.checkEmpty(this.nominatorRole, '[Nominator Role] ') + 
             this.checkEmpty(this.nomineeRole, '[Nominee Role] ') +
             this.checkEmpty(this.procesCase, '[Process Case] ') +
             this.checkEmpty(this.endorserRole, '[Endorser Role] ') +
             this.checkEmpty(this.endorserAddress, '[Endorser Address] ');

    if(errorM !== '') {
      alert('Error: ' + errorM + 'cannot be empty');
      errorM = '';
    } else {
      this.processStorage.vote(this.nominatorRole, this.nomineeRole, this.endorserRole, this.endorserAddress, this.procesCase, this.onNomination === "true", this.isAccepted === "true");
    }    
  }

  openFile(event) {
    const input = event.target;
    var myFile = event.target.files[0];
    var reader = new FileReader();
    reader.readAsText(myFile);
    reader.onload = () => {
      this.bindingPolicy = reader.result.toString();
      
    };
  }

  drawModel(proc: any) {
    let viewer = new Viewer({ container: '#proc.id' + '_canvas' });
    let canvas = viewer.get('#proc.id' + '_canvas');
    viewer.importXML(proc.bpmn, (definitions) => { })
  }

  sendResourceModel() {
      this.processStorage.resourceModel = this.bindingPolicy;
      this.processStorage.sendResourceModel();
  }

  createProcessRegistry() {
     this.processStorage.createProcessRegistry();
  }

  loadProcessRegistry() {
    this.processStorage.loadProcessRegistry(this.registryAddress);
  }

  loadProcessSteps() {
    this.processStorage.loadProcessSteps(this.processID);
    this.stepsProc = this.processStorage.processesStepsList;
  }

  checkProcessTransaction() {
    this.processStorage.checkProcessTransaction(this.transactionID);
  }

  openModeler() {
    this.router.navigateByUrl('/modeler');
  }
  openViewer(procName, instance) {
    this.processStorage.modelId = procName;
    this.processStorage.actInst = instance;
    this.router.navigateByUrl('/viewer');
  }

  searchElement() {
    this.processStorage.searchRegisteredModel(this.toSearch);
  }

  createTaskRole() {
    this.processStorage.createTaskRole(this.rootProcess, this.policyId);
  }

  updateInstances(proc) {
    this.processStorage.updateInstances(proc);
  }

  

  // updateContracts() {
  //   this.processStorage.updateInstances(this.processStorage.modelId);
  //   const res = this.processStorage.getInstance(this.processStorage.modelId);
  //   this.activeContracts = ['No Contracts Available'];
  //   res.forEach(element => {
  //       this.url = 'http://localhost:3000/processes/' + element;
  //       this.activeContracts.push(this.url);
  //   });
  //   if (this.activeContracts.length > 1 && this.activeContracts[0] === 'No Contracts Available') {
  //     this.activeContracts.splice(0, 1);
  //   }
  // }

  

//   ngOnInit(): void {
//     this.viewer = new Viewer({ container: '#canvas' });
//     this.canvas = this.viewer.get('canvas');
//     //this.updateContracts();
//     //this.setupListeners();

//     /////////////////////////// Start //////////////////////////////////////
// /*
//     this.connection = this.getMessages().subscribe(message => {
//       this.loadModel();
//       console.log('Message from Server ...');
//     });
// */
//     //////////////////////////// End //////////////////////////////////////

//   }

  ////////////////////////// Start ///////////////////////////

/*
  getMessages() {
    const observable = new Observable(observer => {
      this.socket = io(this.sURL);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
*/

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {

  }



  /////////////////////// End //////////////////////////////

}
