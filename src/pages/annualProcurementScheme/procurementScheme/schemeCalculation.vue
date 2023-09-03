<template>
  <div class="container">
    <!-- 年度用气需求量 -->
    <div class="header-wrapper">
        <div class="left-wrapper">
          <span class="title">年度用气需求量</span><span class="unit">(单位:万方)</span>
        </div>
        <div class="right-wrapper">
            <el-button type="default" round icon="el-icon-close" v-show="isCancel" @click="handleCancel">取消</el-button>
            <el-button type="default" round icon="el-icon-edit" v-show="edit && detailEditStatus" @click="handleEdit">编辑</el-button>
            <el-button type="default" round icon="el-icon-postcard" v-show="isSave" @click="handleSave">保存</el-button>
            <el-button type="primary" round icon="el-icon-refresh" v-show="true && detailEditStatus" @click="handleResetCache">重置</el-button>
            <!-- <el-button class="calculate-btn" type="primary" round icon="el-icon-tickets" v-show="!edit && hasSupplier"  @click="handleCalculate">测算</el-button> -->
            <el-button class="calculate-btn" type="primary" round icon="el-icon-tickets" v-show="hasSupplier"  @click="handleCalculate">测算</el-button>
        </div>
    </div>
    <div class="content-wrapper">
        <div class="left-wrapper1">
            <el-table
            :data="annualGasDemand"
            ref="annualGasDemandTable"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table-n"   
            border
            v-loading="loading"
            >
                <el-table-column prop="" label="">
                    <span>需求量</span>
                </el-table-column>
                <el-table-column prop="4yue" label="4月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['4']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["4"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="5yue" label="5月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['5']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["5"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="6月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['6']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["6"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="7月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['7']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["7"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="8月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['8']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["8"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="9月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['9']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["9"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="10月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['10']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["10"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="11月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['11']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["11"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="12月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['12']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["12"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="1月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['1']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["1"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="2月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['2']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["2"] || "-" }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="3月" align="right" min-width="60">
                    <template slot-scope="scope">
                        <div v-if="!edit">
                            <el-input v-model="scope.row['3']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'></el-input>
                        </div>
                        <div v-else class="pr24">{{ scope.row["3"] || "-" }}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="right-wrapper1">
            <el-table
            :data="annualGasDemand"
            header-row-class-name="custom-table-header"
            header-cell-class-name="custom-table-header-cell"
            cell-class-name="custom-table-cell"
            class="custom-table-n"   
            border
            >
                <el-table-column label="合计" align="right">
                    <span slot-scope="scope">{{ scope.row.sum }}</span>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <!-- 无购销合同政策时展示 -->
    <div class="tips-wrapper" v-if="!hasSupplier">
        <svg viewBox="0 0 79 86" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="linearGradient-1-3" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%"><stop stop-color="#FCFCFD" offset="0%"></stop><stop stop-color="#EEEFF3" offset="100%"></stop></linearGradient><linearGradient id="linearGradient-2-3" x1="0%" y1="9.5%" x2="100%" y2="90.5%"><stop stop-color="#FCFCFD" offset="0%"></stop><stop stop-color="#E9EBEF" offset="100%"></stop></linearGradient><rect id="path-3-3" x="0" y="0" width="17" height="36"></rect></defs><g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="B-type" transform="translate(-1268.000000, -535.000000)"><g id="Group-2" transform="translate(1268.000000, 535.000000)"><path id="Oval-Copy-2" d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z" fill="#F7F8FC"></path><polygon id="Rectangle-Copy-14" fill="#E5E7E9" transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) " points="13 58 53 58 42 45 2 45"></polygon><g id="Group-Copy" transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)"><polygon id="Rectangle-Copy-10" fill="#E5E7E9" transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) " points="2.84078316e-14 3 18 3 23 7 5 7"></polygon><polygon id="Rectangle-Copy-11" fill="#EDEEF2" points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon><rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-3)" transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) " x="38" y="7" width="17" height="36"></rect><polygon id="Rectangle-Copy-13" fill="#F8F9FB" transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) " points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon></g><rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-3)" x="13" y="45" width="40" height="36"></rect><g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)"><mask id="mask-4-3" fill="white"><use xlink:href="#path-3-3"></use></mask><use id="Mask" fill="#E0E3E9" transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) " xlink:href="#path-3-3"></use><polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-3)" transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) " points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon></g><polygon id="Rectangle-Copy-18" fill="#F8F9FB" transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) " points="62 45 79 45 70 58 53 58"></polygon></g></g></g></svg>           
        <div class="tips-desc">请先配置供应商{{this.year}}年天然气购销合同政策</div>
        <div class="tips-btn"><el-button round type="primary" @click="configurationContractPolicy">配置合同政策</el-button> </div>
    </div>
    <!-- 有购销合同政策，无测算方案时展示 -->
    <div class="tips-wrapper" v-else-if="hasCalculate">
        <svg viewBox="0 0 79 86" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="linearGradient-1-3" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%"><stop stop-color="#FCFCFD" offset="0%"></stop><stop stop-color="#EEEFF3" offset="100%"></stop></linearGradient><linearGradient id="linearGradient-2-3" x1="0%" y1="9.5%" x2="100%" y2="90.5%"><stop stop-color="#FCFCFD" offset="0%"></stop><stop stop-color="#E9EBEF" offset="100%"></stop></linearGradient><rect id="path-3-3" x="0" y="0" width="17" height="36"></rect></defs><g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="B-type" transform="translate(-1268.000000, -535.000000)"><g id="Group-2" transform="translate(1268.000000, 535.000000)"><path id="Oval-Copy-2" d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z" fill="#F7F8FC"></path><polygon id="Rectangle-Copy-14" fill="#E5E7E9" transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) " points="13 58 53 58 42 45 2 45"></polygon><g id="Group-Copy" transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)"><polygon id="Rectangle-Copy-10" fill="#E5E7E9" transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) " points="2.84078316e-14 3 18 3 23 7 5 7"></polygon><polygon id="Rectangle-Copy-11" fill="#EDEEF2" points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon><rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-3)" transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) " x="38" y="7" width="17" height="36"></rect><polygon id="Rectangle-Copy-13" fill="#F8F9FB" transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) " points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon></g><rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-3)" x="13" y="45" width="40" height="36"></rect><g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)"><mask id="mask-4-3" fill="white"><use xlink:href="#path-3-3"></use></mask><use id="Mask" fill="#E0E3E9" transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) " xlink:href="#path-3-3"></use><polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-3)" transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) " points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon></g><polygon id="Rectangle-Copy-18" fill="#F8F9FB" transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) " points="62 45 79 45 70 58 53 58"></polygon></g></g></g></svg> 
        <!-- 在没有测算按钮的时候（应用场景是：有了合同配置后，但是还没有需求量），这加一句文案提示：请先填写年度用气需求量，开始年度采购方案成本最优测算 -->
        <div v-if="edit"><span class="tips-desc">请先填写年度用气需求量，开始年度采购方案成本最优测算</span></div>      
        <div class="tips-desc" v-show="!edit && hasSupplier">点击开始测算，系统将按照成本最优原则生成资源采购方案</div>
        <div class="tips-btn" v-show="!edit && hasSupplier"><el-button round type="primary" @click="handleCalculate">开始测算</el-button> </div>
    </div>
    <div v-else>
      <!-- 采购气量、采购成本 -->
      <div class="container-purchase-wrapper">
          <!-- 左侧tabs，采购气量、采购成本 列表 -->
          <div class="tabs-wrapper">
              <div class="left-wrapper" v-if="tabsType === 'volumn'">
                  <span>(单位:万方)</span>
              </div>
              <el-tabs type="card" @tab-click="handleTabsClick">
                  <el-tab-pane label="采购气量">
                      <div class="purchase-gas-volumn-wrapper" v-show="tabsType === 'volumn'">
                      <div class="purchase-gas-volumn-content-wrapper">
                          <div class="purchase-gas-volumn-content-left-wrapper">
                          <el-table
                              :data="purchaseGasVolumnList"
                              :show-summary="true"
                              header-row-class-name="custom-table-header"
                              header-cell-class-name="custom-table-header-cell"
                              cell-class-name="custom-table-cell"
                              class="custom-table-n"   
                              border
                              v-loading="loading"
                          >
                              <el-table-column prop="supplier_name" label="供应商" :show-overflow-tooltip="true"></el-table-column>
                              <el-table-column prop="4" label="4月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input class="gas-volumn-input" v-model="scope.row['4']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]'  />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row["4"] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="5" label="5月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input class="gas-volumn-input" v-model="scope.row['5']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row["5"]}}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="6" label="6月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['6']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['6'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="7" label="7月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['7']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['7'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="8" label="8月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['8']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['8'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="9" label="9月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['9']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['9'] }}</div>
                                  </template>
                              </el-table-column>                    
                              <el-table-column prop="10" label="10月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['10']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['10'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="11" label="11月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['11']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['11'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="12" label="12月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['12']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['12'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="1" label="1月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['1']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['1'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="2" label="2月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['2']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['2'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="3" label="3月" align="right" min-width="58">
                                  <template slot-scope="scope">
                                  <div v-if="!edit && scope.row.editable">
                                      <el-input v-model="scope.row['3']" oninput='value=(value.match(/^[0-9]+/g) ?? [""])[0]' />
                                  </div>
                                  <div v-else class="pr24">{{ scope.row['3'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="sum" label="合计" align="right" class="pr24" min-width="58">
                                  <template slot-scope="scope">
                                    <div class="pr24">{{ scope.row['sum'] }}</div>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="" label="操作" min-width="58">
                                  <template slot-scope="scope">
                                      <el-button type="text" class="detail-link" @click="handleDetailEvent(scope.row.supplier_code)">明细</el-button>
                                  </template>
                                  </el-table-column>
                          </el-table>
                          </div>
                      </div>
                      </div>            
                  </el-tab-pane>
                  <el-tab-pane label="采购成本">
                      <div class="purchase-cost-wrapper" v-show="tabsType === 'cost'">
                      <div class="purchase-cost-content-wrapper">
                          <div class="purchase-cost-content-left-wrapper">
                          <el-table
                              :data="purchaseCostList"
                              header-row-class-name="custom-table-header"
                              header-cell-class-name="custom-table-header-cell"
                              cell-class-name="custom-table-cell"
                              class="custom-table-n"   
                              border
                              v-loading="loading"
                          >
                              <el-table-column label="供应商" :show-overflow-tooltip="true" min-width="70">
                                  <span slot-scope="scope">{{ scope.row.supplier_shorter_name ? scope.row.supplier_shorter_name : scope.row.supplier_name }}</span>
                              </el-table-column>
                              <el-table-column prop="gas" align="right" min-width="50">
                                  <span slot="header">购气量<br />(万方)</span>
                              </el-table-column>
                              <el-table-column prop="accounted" label="采购占比" align="right" min-width="60">
                                  <span slot-scope="scope">{{getPercent(scope.row.accounted) + "%"}}</span>
                              </el-table-column>
                              <el-table-column prop="not_heating_comprehensive_price" align="right" min-width="90">
                                  <span slot="header">非采暖季综合价格<br />(元/方)</span>
                              </el-table-column>
                              <el-table-column prop="heating_comprehensive_price" align="right" min-width="90">
                                  <span slot="header">采暖季综合价格<br />(元/方)</span>
                              </el-table-column>
                              <el-table-column prop="heating_not_residents_price" align="right" min-width="100">
                                  <span slot="header">采暖季非居综合价格<br />(元/方)</span>
                              </el-table-column>
                              <el-table-column prop="not_residents_price" align="right" min-width="90">
                                  <span slot="header">全年非居综合价格<br />(元/方)</span>
                              </el-table-column>
                              <el-table-column prop="cost_price" align="right" min-width="60">
                                  <span slot="header">采购成本<br />(万元)</span>
                              </el-table-column>
                          </el-table>
                          </div>
                      </div>
                      </div>            
                  </el-tab-pane>
              </el-tabs>
          </div>
          <!-- 右侧综合价格区域 -->
          <div class="purchase-cost-content-right-wrapper">
              <div class="purchase-cost-header-wrapper" :style="{visibility: detailEditStatus ? 'visible' : 'hidden'}">
                  <el-button type="primary" round icon="el-icon-document" @click="generateProgramme">生成方案</el-button>
              </div>      
              <el-table
                  :data="purchaseCostList"
                  header-row-class-name="custom-table-header"
                  header-cell-class-name="custom-table-header-cell"
                  cell-class-name="custom-table-cell"
                  class="custom-table-n"   
                  border
              >
                  <el-table-column label="综合价格 元/方" :render-header="renderHeader" :show-overflow-tooltip="true">
                      <div slot-scope="scope">
                      <span style="float:left; width:40%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;padding: 0;">{{scope.row.supplier_shorter_name ? scope.row.supplier_shorter_name : scope.row.supplier_name}}</span>
                      <span style="float:right; width:54%;  font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding:0; text-align: right;">{{scope.row.comprehensive_price}}</span>
                      </div>
                  </el-table-column>
              </el-table>
          </div>      
      </div>
      <!-- 图表 -->
      <Charts :purchaseCostList="purchaseCostList" :purchaseGasVolumnList="purchaseGasVolumnList" :year="year"/>
    </div>
    <!-- 采购气量中明细弹框 -->
    <CustomDialog ref="customDialog" :customDialogList="customDialogList" :rate="rate" />
    <!-- 生成方案对话框 -->
    <GenerageProgrammeDialog ref="generateProgrammeDialog" :generateProgrammeAction="generateProgrammeAction" />
  </div>
</template>

<script>
import bus from '@/utils/bus.js'
import * as mathjs from 'mathjs'
import api from '@/http/api'
import CustomDialog from '../components/dialog/DetailDialog.vue'
import GenerageProgrammeDialog from '../components/dialog/GenerateSchemeDialog.vue'
import Charts from '../components/chart/Charts.vue'

export default {
    components: {
      CustomDialog,
      GenerageProgrammeDialog,
      Charts
    },    
    props: {
        year: {
            type: String,
            default: ''
        },    
    },
    data() {
        return {
            edit: true,   // 编辑按钮显隐状态
            isCancel: false,    // 取消按钮显隐状态
            isSave: false,  // 保存按钮显隐状态
            isCalculate: false, // 测算按钮显隐状态
            rate: '',   // 明细dialog中使用的夏冬供气比
            annualGasDemand: [
                {
                supplier_name: '合计',
                rowKey: Math.random().toString(),
                editable: true,
                sum: 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
                '1': 0,
                '2': 0,
                '3': 0,
                }
            ],
             // 采购气量列表
            purchaseGasVolumnList: [
                {
                    supplier_name: '合计',
                    rowKey: Math.random().toString(),
                    editable: true,
                    sum: 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0,
                    '10': 0,
                    '11': 0,
                    '12': 0,
                    '1': 0,
                    '2': 0,
                    '3': 0,
                }
            ],
            purchaseCostList: [],   // 采购成本列表
            customDialogList: [], // 明细dialog中需要使用的数据
            tabsType: 'volumn',  // 选项卡切换时的状态值，volumn：采购气量；cost：采购成本
            hasSupplier: false, // 是否有购销合同政策，true：有，false：无
            hasCalculate: false,    // 有购销合同政策，无测算方案，true：成立，false：不成立
            orginPurchaseData: {},  // 存储loadProvisionalPlan接口返回采购测算、采购成本数据，在生成方案逻辑中使用
            schemeItemId: '',   // 方案列表中单击查看或编辑时，传递到此页面的记录id
            detailEditStatus: true,    // 单击方案列表中查看链接时，进入本页面，此时隐藏编辑、测算、生成方案按钮
            loading: false,
            title: '方案测算',
            detailDialogTitle: '',  // 明细对话框标题
        }
    },
    computed: {
        curComCode() {
            return this.$store.getters.curCom
        },
        curComCodeName() {
            return this.$store.getters.curComName
        },
        getPercent() {
            return (num) => {
                return mathjs.multiply(mathjs.bignumber(num), 100)
            }
        }
    },    
    watch: {
      curComCode() {
        this.getList()
      },
      year() {
          this.getList()
      },
      //  监听文本框中的值，文本框中值改变后累加合计值
      annualGasDemand: {
          deep: true,
          handler() {
            let sum = 0
            for(let i=1; i<12; i++) {
                sum +=Number(this.annualGasDemand[0][i])
            }
            this.annualGasDemand[0]['sum'] = sum
          }
      }
    },
    created() {
        this.schemeItemId = this.$route.params.schemeItemId
        const edit = this.$route.params.edit
        if(this.schemeItemId) {
            // 从方案列表页面中单击“查看”或“编辑”按钮后进入到本页面，则走if分支，实现方案查看或编辑
            if(edit) {  // 编辑
                this.edit = false
                this.title = '编辑采购方案'
            } else {    // 查看
                this.detailEditStatus = false
                this.title = '查看采购方案'
            }
            this.loading = true
            api.purchasingEstimation.getPlanById({
                id: this.schemeItemId
            }).then(res => {
                this.loading = false
                if(res && res.length > 0) {
                    this.setTable(res[0].planText.total, res[0].planText.suppliers)
                    this.annualGasDemand = this.purchaseGasVolumnList.filter(item => {
                        return item.supplier_name === '合计（万方）'
                    })
                    this.purchaseGasVolumnList = this.purchaseGasVolumnList.slice(1)    // 去除合计行                    
                    this.getSupplier()
                }
            })
        } else {
            this.getList()
        }
    },
    beforeDestroy() {
        bus.$off('viewWchemeDetailEvent')
    },
    methods: {
        getList() {     
            this.resetStatus() 
            let params = {
                creator: this.$store.getters.loginName,
                xaReig: this.curComCode,
                year: this.year,
                level: this.$store.getters.curComInfo.orgLevel
            }
            this.loading = true
            api.purchasingEstimation.getStore(params).then(res => {
                // console.log('采购气量 采购成本：', res)
                this.loading = false
                if(res[0]) {
                    this.orginPurchaseData = JSON.parse(JSON.stringify(res[0]['planText'])) // 存储采购气量、采购成本原始数据副本，创建方案时用
                }
                if(res) {
                    if(res.length > 0) {
                        this.setTable(res[0].planText.total, res[0].planText.suppliers)
                        // 获取年度用气需求量数据（purchaseGasVolumnList中的合计行）
                        this.annualGasDemand = this.purchaseGasVolumnList.filter(item => {
                            return item.supplier_name === '合计（万方）'
                        })
                        this.purchaseGasVolumnList = this.purchaseGasVolumnList.slice(1)    // 去除合计行
                        // this.purchaseGasVolumnList = this.purchaseGasVolumnList.filter(item => item.supplier_name !== '合计')
                    } else {
                        this.purchaseGasVolumnList = this.purchaseGasVolumnList.slice(1)    // 去除合计行，重置后只显示顶部气度用气需求量
                        this.setTable([], [])
                    }
                    this.getSupplier()
                } else {
                  // 无返回数据
                    this.getSupplier()
                }
            })                  
        },
        setTable(totalTableList, fpTableList) {
            this.purchaseCostList = totalTableList  // 采购成本 列表
            // 采购气量 列表 数据处理
            for (let index in fpTableList) {
              if((Object.prototype.hasOwnProperty.call(fpTableList[index], 'heatingChild') && fpTableList[index].heatingChild.length > 0)
                  || (Object.prototype.hasOwnProperty.call(fpTableList[index], 'noHeatingChild') && fpTableList[index].noHeatingChild.length > 0)) {
                let item = {
                  supplier_name: fpTableList[index].supplier_shorter_name || fpTableList[index].supplier_name,
                  supplier_code: fpTableList[index].supplier_code,
                  sum: fpTableList[index].sum,
                  editable: true,
                  rowKey: Math.random().toString(),
                  gasSupply: fpTableList[index].gasSupply,
                  children: []
                }
                for (let i = 1; i <= 12; i++) {
                  item[i.toString()] = fpTableList[index][i.toString()] ? parseFloat(fpTableList[index][i.toString()], 2) : 0
                }
                for (let i in fpTableList[index].heatingChild) {
                  item.children[i] = {
                    supplier_name: '',
                    nameA: fpTableList[index].noHeatingChild[i] ? fpTableList[index].noHeatingChild[i].name : '-',
                    nameB: fpTableList[index].heatingChild[i].name,
                    sum: null,
                    editable: false,
                    rowKey: Math.random().toString(),
                    '4': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['4'], 2) : '-',
                    '5': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['5'], 2) : '-',
                    '6': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['6'], 2) : '-',
                    '7': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['7'], 2) : '-',
                    '8': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['8'], 2) : '-',
                    '9': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['9'], 2) : '-',
                    '10': fpTableList[index].noHeatingChild[i] ? parseFloat(fpTableList[index].noHeatingChild[i]['10'], 2) : '-',
                    '11': parseFloat(fpTableList[index].heatingChild[i]['11'], 2),
                    '12': parseFloat(fpTableList[index].heatingChild[i]['12'], 2),
                    '1': parseFloat(fpTableList[index].heatingChild[i]['1'], 2),
                    '2': parseFloat(fpTableList[index].heatingChild[i]['2'], 2),
                    '3': parseFloat(fpTableList[index].heatingChild[i]['3'], 2),
                  }
                  this.$set(this.purchaseGasVolumnList, index, item)
                }
              } else {
                let item = {
                  supplier_name: fpTableList[index].supplier_name,
                  supplier_code: fpTableList[index].supplier_code,
                  rowKey: Math.random().toString(),
                  editable: true,
                  sum: fpTableList[index].sum || 0
                }
                for (let i = 1; i <= 12; i++) {
                  item[i.toString()] = fpTableList[index][i.toString()] ? parseFloat(fpTableList[index][i.toString()], 2) : 0
                }
                // this.$set(this.fpTable.list, index, item)
                this.$set(this.purchaseGasVolumnList, index, item)
              }
            }            
        },        
        // 重置缓存
        handleResetCache() {
            const params = {
                creator: this.$store.getters.loginName,
                xaReig: this.$store.getters.curCom,
                year: this.year
            }
            this.loading = true
            api.purchasingEstimation.resetStore(params).then(res => {
                this.loading = false
                if(res) {
                    this.$message({
                        message: '重置成功！',
                        type: 'success',
                        duration: 1000
                    })
                    this.purchaseCostList = []
                    this.annualGasDemand = [
                        {
                            supplier_name: '合计',
                            rowKey: Math.random().toString(),
                            editable: true,
                            sum: 0,
                            '4': 0,
                            '5': 0,
                            '6': 0,
                            '7': 0,
                            '8': 0,
                            '9': 0,
                            '10': 0,
                            '11': 0,
                            '12': 0,
                            '1': 0,
                            '2': 0,
                            '3': 0,
                        }
                    ]                        
                    this.purchaseGasVolumnList = [
                        {
                            supplier_name: '合计',
                            rowKey: Math.random().toString(),
                            editable: true,
                            sum: 0,
                            '4': 0,
                            '5': 0,
                            '6': 0,
                            '7': 0,
                            '8': 0,
                            '9': 0,
                            '10': 0,
                            '11': 0,
                            '12': 0,
                            '1': 0,
                            '2': 0,
                            '3': 0,
                        }
                    ]
                    // 触发重置缓存按钮事件
                    this.getList()
                }
            })
        },
        // 编辑
        handleEdit() {
            this.edit = false
            this.isCancel = true
            this.isSave = true
            // 触发编辑事件，PurchaseGasVolumnCost组件监听此事件，设置表格区域可编辑状态
            // bus.$emit('editEvent')   
        },
        // 取消
        handleCancel() {
            this.edit = true
            this.isSave = false
            this.isCancel = false
            // 触发取消按钮事件，PurchaseGasVolumnCost组件监听此事件，取消表格区域可编辑状态
            bus.$emit('cancelEvent')
        },
        // 保存
        handleSave() {
            this.edit = true
            this.isSave = false
            this.isCancel = false
            this.isCalculate = true
            // 调用保存合同年度用气需求量接口
            const params = {
                creator: this.$store.getters.loginName,
                year: this.year,
                xaReig: this.$store.getters.curCom,
            }
            const row = this.annualGasDemand[0] // 合计行数据
            let data = {}
            for(let i=1; i<13; i++) {
                data[i.toString()] = {
                    total: parseFloat(row[i.toString()])
                }
            }
            this.loading = true       
            api.purchasingEstimation.saveAnnualGasDemand(params, data).then(res => {
                this.loading = false
                if(res.length > 0) {
                    // this.setTable(res[0].total, res[0].suppliers)
                    this.getList()  // 调用getList()，重新计算年度用气需求量列表数据
                    this.$message({
                        message: '保存成功!',
                        type: 'success',
                        duration: 2000
                    })
                    // busEvent 单击“保存”按钮时，触发事件
                    // bus.$emit('saveEvent')
                }
            })
        },
        // 测算
        handleCalculate() {
            // 判断合计值各月份值是否大于0，如果不大于0 ，则禁止测算
            let total = this.annualGasDemand[0]
            let errorMonth = ''
            for(let i=1; i < 13; i++) {
                // if(total[i] <= 0) {
                if(total[i] === '') {
                    errorMonth += '、' + i + '月'
                }
            }
            if(errorMonth !== '') {
                // errorMonth += '需求量值不能为0，请修正。'
                errorMonth += '需求量值不能为空，请修正。'
                this.$message({
                    message: errorMonth.substring(1),
                    type: 'error'
                })
                return false                
            }

            if(this.purchaseGasVolumnList.length > 1) {
                this.calculateDataAgain()
            } else {
                this.calculateData()
            }
        },
        // 清除缓存后执行测算
        calculateData() {
            let params = {
                creator: this.$store.getters.loginName,
                year: this.year,
                xaReig: this.$store.getters.curCom
            }
            const row = this.annualGasDemand[0] // 合计行数据
            let data = {}
            for(let i=1; i<13; i++) {
                data[i.toString()] = {
                    total: parseFloat(row[i.toString()])
                }
            }
            this.loading = true
            api.purchasingEstimation.getDataByTotal(params,data).then(res => {
                this.loading = false
                if(res.length > 0) {
                    // 测算完成，调用 setTable方法 重置采购气量和采购成本列表
                    this.setTable(res[0].total, res[0].suppliers)
                    this.$message({
                        message: '已完成测算!',
                        type: 'success'
                    })
                    // this.edit = false
                    this.getList()
                }
            })
        },
        // 未清除缓存，有采购气量情况下执行测算
        calculateDataAgain() {
            let params = {
                creator: this.$store.getters.loginName,
                year: this.year,
                xaReig: this.$store.getters.curCom
            }
            let total = this.annualGasDemand[0]
            let totalExe = {
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0,
                '10': 0,
                '11': 0,
                '12': 0,
                '1': 0,
                '2': 0,
                '3': 0,
            }

            for (let index in this.purchaseGasVolumnList) {
                for (let i = 1; i < 13; i++) {
                    this.purchaseGasVolumnList[index][i.toString()] = this.purchaseGasVolumnList[index][i.toString()] ? parseFloat(this.purchaseGasVolumnList[index][i.toString()]) : 0
                    // ------------*********** 已将合计行从this.purchaseGasVolumnList清除了，所以下面的判断由原来的index>0改为index>=0
                    if(index >= 0) {
                        totalExe[i.toString()] = mathjs.add(mathjs.bignumber(totalExe[i.toString()]), mathjs.bignumber(this.purchaseGasVolumnList[index][i.toString()]))
                        // totalExe[i.toString()] = mathjs.add(totalExe[i.toString()], this.purchaseGasVolumnList[index][i.toString()])
                    }
                }
            }

            let errorMonth = ''
            for (let i = 1; i < 13; i++) {
                if(total[i].toString() !== totalExe[i.toString()].toString()) {
                errorMonth += '、' + i + '月'
                }
            }
            if(errorMonth !== '') {
                errorMonth += '合计总量与各供应商气量合计值不相等，请修正。'
                this.$message({
                message: errorMonth.substring(1),
                type: 'error'
                })
                return false
            }
            let resultArr = this.annualGasDemand.concat(this.purchaseGasVolumnList)
            this.loading = true
            // api.purchasingEstimation.getDataByTotalAgain(params, this.purchaseGasVolumnList).then(res => {
            api.purchasingEstimation.getDataByTotalAgain(params, resultArr).then(res => {
                this.loading = false
                if (res.length > 0) {
                    this.planText = res[0]
                    this.getList()
                    this.$message({
                        message: '已完成测算！',
                        type: 'success'
                    });
                }
            })
        },
        // 右侧表格 列标题 渲染函数（标题文本样式不同）
        renderHeader(h, {column}) {
            return h(
                'div',
                [
                    h(
                        'span',
                        {
                            style:'font-size: 18px;margin-right:10px'
                        }, 
                        '综合价格'
                    ),
                    h(
                        'span', 
                        {
                            style:'font-size: 14px;'
                        }, 
                        '元/方'
                    )
                ]
            )
        },        
        // 选项卡 tab-click 事件
        handleTabsClick({index, label}) {
          if(label === '采购气量') {
            this.tabsType = 'volumn'
          } else if(label === '采购成本') {
            this.tabsType = 'cost'
          }
        },        
        // 明细 事件
        handleDetailEvent(supplierCode) {
          this.currentSupplierCode = supplierCode
          this.$refs.customDialog.visible = true
          const currentRecord = this.purchaseGasVolumnList.filter(item => item.supplier_code === supplierCode)[0]  // 获取当前记录对应的明细数据（记录中children）
          this.customDialogList = currentRecord['children']  // 明细数据
          this.detailDialogTitle = currentRecord['supplier_shorter_name'] ? currentRecord['supplier_shorter_name'] : currentRecord['supplier_name']
          //   父级合计数据
          const totalArr = {
              '1': currentRecord['1'],
              '2': currentRecord['2'],
              '3': currentRecord['3'],
              '4': currentRecord['4'],
              '5': currentRecord['5'],
              '6': currentRecord['6'],
              '7': currentRecord['7'],
              '8': currentRecord['8'],
              '9': currentRecord['9'],
              '10': currentRecord['10'],
              '11': currentRecord['11'],
              '12': currentRecord['12'],
              'nameA': '合计'
          }
          this.customDialogList = this.customDialogList.concat(totalArr)  // 将合计数据填充到children末尾（在明细dialog中显示出合计值）
          // 统计每条记录1月至12月数据和
          this.customDialogList.map(item => {
            item.vSum = 0
            for(let i=1; i<13; i++) {
              item.vSum += parseFloat(item[i.toString()]) ? parseFloat(item[i.toString()]) : 0
            }
          })          
          this.rate = currentRecord['gasSupply'] // 夏冬供气比
        },
        // 判断是否有合同政策（供应商）
        getSupplier() {
            this.hasSupplier =false // 是否有购销合同政策，true：有，false：无
            this.hasCalculate =false   // 有购销合同政策，无测算方案，true：成立，false：不成立            
            const params = {
                xaReig: this.curComCode,
                year: this.year
            }
            // console.log('有supplylist下测算：', this.purchaseGasVolumnList, this.hasCalculate)
            api.purchasingEstimation.getSupplier(params).then(res => {
                if(res && res[0] > 0) {
                    // 如果数量大于0则表示有配置合同政策
                    this.hasSupplier = true
                    // 判断 有购销合同政策，无测算方案情况，如果 this.purchaseGasVolumnList.length 等于1时，则说明接口未返回采购气量数据，这1条是初始化的默认数据
                    if(res[0] > 0 && this.purchaseGasVolumnList.length < 1) {
                      this.hasCalculate = true
                    }
                }
            })
        },
        // 生成方案按钮事件（显示生成方案dialog）
        generateProgramme() {
          this.$refs.generateProgrammeDialog.visible = true
          this.$refs.generateProgrammeDialog.name = ''
        },
        // 生成方案操作（方案列表中新增数据）
        generateProgrammeAction(name = '') {
            let data = {
                name: name,
                planText: this.orginPurchaseData,
                xaReig: this.curComCode,
                xaReigTxt: this.curComCodeName,
                year: this.year
            }

            // if(!this.isAddPlan) {
            //     data.id = this.editPlanItem.id
            // }
            this.loading = true
            api.purchasingEstimation.createPlan(data).then(res => {
                this.loading = false
                if (res) {
                    this.$refs.generateProgrammeDialog.name = ''
                    this.$refs.generateProgrammeDialog.visible = false
                    this.$message({
                        message: '生成方案成功！',
                        type: 'success',
                        duration: 1000
                    })
                    // this.submitBtnDisabled = false
                }
            })
        },
        // 重置状态
        resetStatus() {
            this.edit =true  // 编辑按钮显隐状态
            this.isCancel =false    // 取消按钮显隐状态
            this.isSave =false  // 保存按钮显隐状态
            this.isCalculate =false // 测算按钮显隐状态
            this.tabsType ='volumn'  // 选项卡切换时的状态值，volumn：采购气量；cost：采购成本
            // this.hasSupplier =false // 是否有购销合同政策，true：有，false：无
            // this.hasCalculate =false   // 有购销合同政策，无测算方案，true：成立，false：不成立
        },
        // 跳转到配置合同政策页面
        configurationContractPolicy() {
            this.$router.push({
                path: 'agreementDeploy'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        .header-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 10px;
            .left-wrapper {
              .title {
                color: #303133;
                font-size: 16px;
                font-weight: 500;
              }
              .unit {
                color: #606266;
                font-size: 14px;
                font-weight: 400;
              }
            }
            .right-wrapper {
                /deep/ .el-button {
                    width: 79px;
                    height: 32px;
                    padding: 0;
                    background: #F5F7FA;
                    color: #303133;
                    border: 1px solid #DCDFE6;
                }
                .calculate-btn {
                  background: #47A87D;
                  color: #fff;
                }
            }
        }
        .content-wrapper {
            display: flex;
            justify-content: space-between;
            .left-wrapper1 {
                width: calc(100% - 137px);
                margin-right: 10px;
                  /* 给除首列外的其他列设置样式 */
                  /deep/ .el-table__row td:not(:first-child){
                    .cell {
                      padding: 5px!important;
                    }
                  }
                  .pr24 {
                    padding: 0 5px;
                  }
                  /deep/ .el-table th .cell {
                      padding: 0px 10px!important;
                  }
                  /deep/ .el-table__row .cell {
                      padding: 0 10px!important;
                  }                  
            }
            .right-wrapper1 {
                width: 137px;
                /deep/ .el-table__empty-text {
                    width: auto;
                    padding: 0;
                    margin: 0;
                }
                /deep/ .custom-table-header th:first-child {
                    background: #47A87D;
                    color: #fff;
                    font-size: 18px;
                }
            }
        }
        .container-purchase-wrapper {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            .tabs-wrapper {
                padding-right: 10px;
                width: calc(100% - 137px);
                position: relative;
                /deep/ .el-tabs__header {
                    margin-bottom: 10px;
                }
                /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
                    border-radius: 8px 8px 0 0;
                }                
                /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
                    background: #47A87D;
                    color: #fff;
                }
                /deep/ .el-tabs--card >.el-tabs__header .el-tabs__item:first-child.is-active {
                  border-top-left-radius: 8px;
                }
                /deep/ .el-tabs--card >.el-tabs__header .el-tabs__item:last-child.is-active {
                  border-top-right-radius: 8px;
                }                                         
                .left-wrapper {
                    position: absolute;
                    top: 15px;
                    left:205px;
                    color: #606266;
                    font-size: 14px;
                    font-weight: 400;
                }
                /* 采购气量 */
                .purchase-gas-volumn-wrapper {
                    display: flex;
                    flex-direction: column;
                    .purchase-gas-volumn-content-wrapper {
                        display: flex;
                        .purchase-gas-volumn-content-left-wrapper {
                            width: 100%;
                            .detail-link {
                                color: #409EFF;
                                cursor: pointer;
                            }
                            /* 除首列、最后一列、第14列（合计）外，给其他列设置样式    /deep/ .el-table__row td:not(:first-child):not(:last-child):not(:nth-child(14)) */
                            /deep/ .el-table__row td:not(:first-child):not(:last-child){
                                .cell {
                                    padding: 0 5px!important;
                                }
                            }
                            /deep/ .el-table th .cell {
                                padding: 0 10px!important;
                            }
                            .pr24 {
                                padding: 0 5px;
                            }
                            /deep/ .el-table__row .cell {
                                padding: 0 10px!important;
                            }
                            /deep/ .el-table__footer-wrapper .cell {
                                color: #303133;
                                font-size: 14px;
                                font-weight: 500;
                                padding: 0 14px!important;
                            }
                        }
                    }
                }
                /* 采购成本 */
                .purchase-cost-wrapper {
                    display: flex;
                    flex-direction: column;
                    .purchase-cost-content-wrapper {
                        display: flex;
                        .purchase-cost-content-left-wrapper {
                            width: 100%;
                            /deep/ .el-table th {
                                padding: 1px 0!important;
                            }
                            /deep/ .el-table th .cell {
                                padding: 0px 10px!important;
                            }
                            /deep/ .el-table__row .cell {
                                padding: 0 10px!important;
                            }
                            /deep/ .el-table__row:last-child {
                                background: #F5F7FA;
                                .cell {
                                    color: #303133;
                                    font-size: 14px;
                                    font-weight: 500;
                                }
                            }
                        }
                    }
                }                
            }
            .purchase-cost-content-right-wrapper {
                width: 137px;
                margin-top: 8px;
                /* 导出、生成方案 按钮 */
                .purchase-cost-header-wrapper {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 10px;
                    /deep/ .el-button {
                        width: 79px;
                        height: 32px;
                        padding: 0;
                    }
                    /deep/ .el-button--primary {
                        width: 107px;
                    }
                }                  
                /deep/ .el-table__empty-text {
                    width: auto;
                    padding: 0;
                    margin: 0;
                }
                /deep/ .custom-table-header th:first-child {
                    background: #47A87D;
                    color: #fff;
                    .cell {
                        padding: 0!important;
                        text-align: center;
                    }
                }
                /deep/ .el-table__row{
                    .cell {
                        padding: 0 7px!important;
                    }
                }                
            }
        }
        .tips-wrapper {
            display: flex;
            flex-direction: column;
            height: 260px;
            justify-content: center;
            align-items: center;
            margin-top: 98px;
            margin-bottom: 198px;
            .tips-desc {
                color: #303133;
                font-size: 14px;
                font-weight: 400;
                margin-top: 20px;
                margin-bottom: 10px;
            }
            .tips-btn {

            }
        }
    }
</style>