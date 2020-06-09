import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { uniqBy } from '../../utils';

interface ISelectListMember {
  label: string;
  select: string;
  count: number;
}

@Component({
  styleUrl: 'cronk-selector.scss',
  tag: 'cronk-selector',
})
export class CronkSelector {
  @State() activeSelection: any = {};
  @State() reference?: ISelectListMember[];
  @State() referenceTotal = 0;

  @Prop() heading = '';
  @Prop() label = 'COUNT';
  @Prop() selector: any;
  @Prop() selectList: ISelectListMember[] = [];
  @Prop() selectAllOnLoad = true;
  @Prop() minimumSelection = 0;

  @Watch('selectList')
  async updateSelectList() {
    const newReference: ISelectListMember[] = uniqBy(this.selectList, 'select').map(s => {
      s.label = s.label.replace(/(.{5}).+(.{5})/g, '$1...$2');
      return s;
    });
    if (this.reference === undefined || newReference.length > this.reference.length) {
      this.reference = newReference;
      this.referenceTotal = newReference.reduce(
        (newTotal: number, newRef: ISelectListMember) => newTotal + (newRef.count || 0),
        0,
      );
      if (!this.selectAllOnLoad) return;

      const active = Object.assign(
        {},
        ...newReference.map((selection: ISelectListMember) => {
          return {
            [selection.select]:
              this.activeSelection[selection.select] === undefined ? true : this.activeSelection[selection.select],
          };
        }),
      );
      this.activeSelection = active;
    }
  }

  unsetAllActive(reference: ISelectListMember[]) {
    return Object.assign(
      {},
      ...reference.map((selection: ISelectListMember) => {
        return {
          [selection.select]: false,
        };
      }),
    );
  }

  setAllActive(reference: ISelectListMember[]) {
    return Object.assign(
      {},
      ...reference.map((selection: ISelectListMember) => {
        return {
          [selection.select]: true,
        };
      }),
    );
  }

  selectAllThings(event: Event) {
    if (!this.reference) return;
    const el = event.target as HTMLIonCheckboxElement;
    this.activeSelection = el && !el.checked ? this.unsetAllActive(this.reference) : this.setAllActive(this.reference);
    this.selectThingHandler();
  }

  toggleThingSelection(_: Event, { select }: ISelectListMember) {
    this.activeSelection = { ...this.activeSelection, [select]: !this.activeSelection[select] };
    this.selectThingHandler();
  }

  selectThingHandler() {
    const selectedThings = Object.entries(this.activeSelection)
      .filter(([_, selected]) => selected)
      .map(([thing]) => thing);
    const newFilter = (blob: any) => {
      if (this.selector in blob) {
        return selectedThings.includes(blob[this.selector]);
      }
      return true; // Only filter if it has what you're looking for
    };

    document.querySelectorAll('.cronk-filtered-datastream').forEach((stream: any) => {
      stream.addFilter(this.selector, newFilter);
    });
  }

  render() {
    if (this.reference === undefined) return null;

    const selectedThingsLength = Object.values(this.activeSelection).filter(x => !!x).length;
    return (
      <Host class={`${this.selector}-selector thing-selector`}>
        {this.heading ? <h5>{this.heading}</h5> : null}
        <table class="fixed">
          <thead>
            <tr>
              <th>
                <ion-item lines="none" class={`select-all-things select-all-${this.selector}`}>
                  {this.reference.length > 1 && (
                    <ion-checkbox
                      onClick={(e: Event) => this.selectAllThings(e)}
                      value="selectall"
                      checked={this.reference.length === selectedThingsLength}
                      indeterminate={this.reference.length > selectedThingsLength && selectedThingsLength > 0}
                      color="secondary"
                      slot="start"
                    />
                  )}
                  <span class="select-label">{`${this.reference.length > 1 ? 'SELECT ' : ''}`}</span>
                </ion-item>
              </th>
              <th />
              <th>{this.label}</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {this.reference &&
              this.reference.map((b: ISelectListMember) => {
                const { select, label, count } = b;
                const proportion = count / this.referenceTotal;

                return (
                  <tr key={select}>
                    <td>
                      <ion-item lines="none">
                        {this.reference && this.reference.length > 1 && (
                          <ion-checkbox
                            onClick={(e: Event) => this.toggleThingSelection(e, b)}
                            checked={select in this.activeSelection && this.activeSelection[select]}
                            value={select}
                            slot="start"
                            color="secondary"
                          />
                        )}
                        <ion-label>{label}</ion-label>
                      </ion-item>
                    </td>
                    <td>
                      <ion-progress-bar value={proportion} />
                    </td>
                    <td>{count}</td>
                    <td>({(proportion * 100).toFixed(1)}%)</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Host>
    );
  }
}
