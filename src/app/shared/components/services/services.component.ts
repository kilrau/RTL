import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ResolveEnd, Event } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import { ConfigSettingsNode } from '../../models/RTLconfig';
import { RTLState } from '../../../store/rtl.state';
import { rootSelectedNode } from '../../../store/rtl.selector';

@Component({
  selector: 'rtl-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {

  public faLayerGroup = faLayerGroup;
  public showLnConfig = false;
  public showBitcoind = false;
  public selNode: ConfigSettingsNode;
  public lnImplementationStr = '';
  public links = [{ link: 'layout', name: 'Layout' }, { link: 'auth', name: 'Authentication' }, { link: 'lnconfig', name: this.lnImplementationStr }, { link: 'bconfig', name: 'BitcoinD Config' }];
  public activeLink = '';
  private unSubs: Array<Subject<void>> = [new Subject(), new Subject(), new Subject()];

  constructor(private store: Store<RTLState>, private router: Router) { }

  ngOnInit() {
    const linkFound = this.links.find((link) => this.router.url.includes(link.link));
    this.activeLink = linkFound ? linkFound.link : this.links[0].link;
    this.router.events.pipe(takeUntil(this.unSubs[0]), filter((e) => e instanceof ResolveEnd)).
      subscribe({
        next: (value: ResolveEnd | Event) => {
          const linkFound = this.links.find((link) => (<ResolveEnd>value).urlAfterRedirects.includes(link.link));
          this.activeLink = linkFound ? linkFound.link : this.links[0].link;
        }
      });
    this.store.select(rootSelectedNode).pipe(takeUntil(this.unSubs[1])).
      subscribe((selNode) => {
        this.showLnConfig = false;
        this.showBitcoind = false;
        this.selNode = selNode;
        switch (this.selNode.lnImplementation.toUpperCase()) {
          case 'CLN':
            this.lnImplementationStr = 'Core Lightning Config';
            break;

          case 'ECL':
            this.lnImplementationStr = 'Eclair Config';
            break;

          default:
            this.lnImplementationStr = 'LND Config';
            break;
        }
        if (this.selNode.authentication && this.selNode.authentication.configPath && this.selNode.authentication.configPath.trim() !== '') {
          this.links[2].name = this.lnImplementationStr;
          this.showLnConfig = true;
        }
        if (this.selNode.settings && this.selNode.settings.bitcoindConfigPath && this.selNode.settings.bitcoindConfigPath.trim() !== '') {
          this.showBitcoind = true;
        }
      });
  }

  ngOnDestroy() {
    this.unSubs.forEach((completeSub) => {
      completeSub.next(null);
      completeSub.complete();
    });
  }

}