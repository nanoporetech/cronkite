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
  @Prop() selector: any;
  @Prop() selectList: ISelectListMember[] = [];

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

  selectAllThings(event: Event) {
    if (!this.reference) return;

    const el = event.target as HTMLIonCheckboxElement;
    if (el && !el.checked) {
      el.checked = true;
      return;
    }
    const allActive = Object.assign(
      {},
      ...this.reference.map((selection: ISelectListMember) => {
        return {
          [selection.select]: true,
        };
      }),
    );
    this.activeSelection = allActive;
    this.selectThingHandler();
  }

  toggleThingSelection(event: Event, { select }: ISelectListMember) {
    const el = event.target as HTMLIonCheckboxElement;
    const entries = Object.entries(this.activeSelection);
    const currentSelections = entries.filter(([_, selected]) => selected);
    const alreadySelected = select in this.activeSelection && this.activeSelection[select];

    if (el && currentSelections.length === 1 && alreadySelected) {
      el.checked = true;
      return;
    }
    this.activeSelection = { ...this.activeSelection, [select]: !this.activeSelection[select] };
    this.selectThingHandler();
  }

  selectThingHandler() {
    const selectedThings = Object.entries(this.activeSelection)
      .filter(([_, selected]) => selected)
      .map(([thing]) => thing);

    if (!selectedThings.length) return; // Minimum one selected

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

    const selectedThings = Object.values(this.activeSelection).filter(x => !!x);
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
                      checked={this.reference.length === selectedThings.length}
                      indeterminate={this.reference.length > selectedThings.length}
                      color="secondary"
                      slot="start"
                    />
                  )}
                  <span class="select-label">{`${this.reference.length > 1 ? 'SELECT ' : ''}`}</span>
                </ion-item>
              </th>
              <th />
              <th>READS</th>
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
