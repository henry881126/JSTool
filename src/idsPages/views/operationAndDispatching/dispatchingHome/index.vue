<!--
  * @Description:首页
  * @Author:jiawenjin
  * @Date:2021-10-12
-->
<template>
  <div class="delivery-wrapper gas-page-bg" id="delivery-wrapper">
    <top-menu title="天然气输配（调度）智慧管理平台"></top-menu>
    <div class="content-wrapper" id="wrapper">
      <div id="container" style="width: 1880px">
        <div class="container-left">
          <!--日用气量执行跟踪 -->
          <section class="dailygas-box">
            <div class="title">
              <h5>日用气量执行跟踪</h5>
              <div class="select">
                <o-select
                  @changeOption="onChangeOption"
                  @changeShowStatus="changeShowStatus"
                  :selectData="selectData"
                ></o-select>
              </div>
              <router-link :to="{ name: 'gasVolumeTracking' }" tag="p"
                >详情<i class="el-icon-caret-right"></i
              ></router-link>
            </div>
            <div class="dailygas-top">
              <div class="progress">
                <el-progress
                  type="circle"
                  class="progress-common"
                  :percentage="
                    dailyGasData.usedRate && dailyGasData.usedRate > 0
                      ? dailyGasData.usedRate > 100
                        ? 100
                        : dailyGasData.usedRate
                      : 0
                  "
                  :stroke-width="20"
                  stroke-linecap="butt"
                  color="#47A87D"
                  :width="122"
                ></el-progress>
                <p>{{ dailyGasData.usedRate ? dailyGasData.usedRate : 0 }}%</p>
              </div>
              <div class="wrapper-table">
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>当日总指定量</p>
                    <p>当日总提取量</p>
                    <p>当日剩余总提取量</p>
                    <p>-</p>
                  </dt>
                  <dd>
                    <div>万m³</div>
                    <p>
                      {{
                        dailyGasData.replyVolume
                          ? dailyGasData.replyVolume
                          : "-"
                      }}
                    </p>
                    <p>
                      {{
                        dailyGasData.volumeUsed ? dailyGasData.volumeUsed : "-"
                      }}
                    </p>
                    <p>
                      {{
                        dailyGasData.balanceVolumeUsable
                          ? dailyGasData.balanceVolumeUsable
                          : "-"
                      }}
                    </p>
                    <p>-</p>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>剩余平均提取流量</p>
                    <p>剩余时间</p>
                    <p>-</p>
                    <p>-</p>
                  </dt>
                  <dd>
                    <div></div>
                    <p>
                      {{
                        dailyGasData.balanceAvgUsable
                          ? dailyGasData.balanceAvgUsable
                          : "-"
                      }}万m³/h
                    </p>
                    <p>
                      {{
                        dailyGasData.balanceHour
                          ? dailyGasData.balanceHour
                          : "-"
                      }}h
                    </p>
                    <p>-</p>
                    <p>-</p>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>当日输配能力上限</p>
					<p>当前全网输配能力</p>
                    <p>当日剩余输配能力</p>
                    <p>当前输配能力占比</p>
                  </dt>
                  <dd>
                    <div></div>
                    <p>
                      {{
                        dailyGasData.instantFlowUp
                          ? dailyGasData.instantFlowUp
                          : "-"
                      }}万m³/h
                    </p>
					<p>
                      {{
                        dailyGasData.currentInstantFlow
                          ? dailyGasData.currentInstantFlow
                          : "-"
                      }}万m³/h
                    </p>
                    <p>
                      {{
                        dailyGasData.balanceInstantFlow
                          ? dailyGasData.balanceInstantFlow
                          : "-"
                      }}万m³/h
                    </p>
                    <p>
                      {{
                        dailyGasData.instantFlowRate
                          ? dailyGasData.instantFlowRate
                          : "-"
                      }}%
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
          </section>
          <!-- 客户用气执行跟踪 -->
          <section class="usegas-box">
            <div class="title">
              <h5>客户用气执行跟踪</h5>
            </div>
            <div class="tips-group">
              <router-link
                :to="{
                  name: 'customerStatusMonitoring',
                  params: { type: directSales.contractType },
                }"
                tag="div"
                class="tips"
              >
                <div class="tips-top">
                  <div class="tips-left">
                    <h5>
                      <span style="height: 22px">直销</span>
                      <span
                        ><img
                          :src="
                            require('@/idsPages/images/dispatchingHome/icon1.png')
                          "
                        />{{ directSales.customerNum }}</span
                      >
                    </h5>
                    <div class="usegas-progress">
                      <usegas-water
                        :percentage="directSales.usedRate"
                      ></usegas-water>
                    </div>
                  </div>
                  <div class="wrapper-table">
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>指定量</p>
                        <p>已提取量</p>
                        <p>未提取量</p>
                      </dt>
                      <dd>
                        <div>万m³</div>
                        <p>
                          {{
                            directSales.replyVolume
                              ? directSales.replyVolume
                              : "-"
                          }}
                        </p>
                        <p>
                          {{
                            directSales.volumeUsed
                              ? directSales.volumeUsed
                              : "-"
                          }}
                        </p>
                        <p>
                          {{
                            directSales.balanceVolumeUsable
                              ? directSales.balanceVolumeUsable
                              : "-"
                          }}
                        </p>
                      </dd>
                    </dl>
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>总瞬时量</p>
                        <p>剩余时间</p>
                      </dt>
                      <dd>
                        <div></div>
                        <p>
                          {{
                            directSales.currentInstantFlow
                              ? directSales.currentInstantFlow
                              : "-"
                          }}万m³/h
                        </p>
                        <p>
                          {{
                            directSales.balanceHour
                              ? directSales.balanceHour
                              : "-"
                          }}h
                        </p>
                      </dd>
                    </dl>
                  </div>
                </div>
              </router-link>
              <router-link
                :to="{
                  name: 'customerStatusMonitoring',
                  params: { type: agentSales.contractType },
                }"
                tag="div"
                class="tips"
              >
                <div class="tips-top">
                  <div class="tips-left">
                    <h5>
                      <span style="height: 22px">代销</span>
                      <span
                        ><img
                          :src="
                            require('@/idsPages/images/dispatchingHome/icon1.png')
                          "
                        />{{ agentSales.customerNum }}</span
                      >
                    </h5>
                    <div class="usegas-progress">
                      <usegas-water
                        :percentage="agentSales.usedRate"
                      ></usegas-water>
                    </div>
                  </div>
                  <div class="wrapper-table">
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>指定量</p>
                        <p>已提取量</p>
                        <p>未提取量</p>
                      </dt>
                      <dd>
                        <div>万m³</div>
                        <p>
                          {{
                            agentSales.replyVolume
                              ? agentSales.replyVolume
                              : "-"
                          }}
                        </p>
                        <p>
                          {{
                            agentSales.volumeUsed ? agentSales.volumeUsed : "-"
                          }}
                        </p>
                        <p>
                          {{
                            agentSales.balanceVolumeUsable
                              ? agentSales.balanceVolumeUsable
                              : "-"
                          }}
                        </p>
                      </dd>
                    </dl>
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>总瞬时量</p>
                        <p>剩余时间</p>
                      </dt>
                      <dd>
                        <div></div>
                        <p>
                          {{
                            agentSales.currentInstantFlow
                              ? agentSales.currentInstantFlow
                              : "-"
                          }}万m³/h
                        </p>
                        <p>
                          {{
                            agentSales.balanceHour
                              ? agentSales.balanceHour
                              : "-"
                          }}h
                        </p>
                      </dd>
                    </dl>
                  </div>
                </div>
              </router-link>
              <router-link
                :to="{
                  name: 'customerStatusMonitoring',
                  params: { type: agentTransport.contractType },
                }"
                tag="div"
                class="tips"
              >
                <div class="tips-top">
                  <div class="tips-left">
                    <h5>
                      <span style="height: 22px">代输</span>
                      <span
                        ><img
                          :src="
                            require('@/idsPages/images/dispatchingHome/icon1.png')
                          "
                        />{{ agentTransport.customerNum }}</span
                      >
                    </h5>
                    <div class="usegas-progress">
                      <usegas-water
                        :percentage="agentTransport.usedRate"
                      ></usegas-water>
                    </div>
                  </div>
                  <div class="wrapper-table">
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>指定量</p>
                        <p>已提取量</p>
                        <p>未提取量</p>
                      </dt>
                      <dd>
                        <div>万m³</div>
                        <p>
                          {{
                            agentTransport.replyVolume
                              ? agentTransport.replyVolume
                              : "-"
                          }}
                        </p>
                        <p>
                          {{
                            agentTransport.volumeUsed
                              ? agentTransport.volumeUsed
                              : "-"
                          }}
                        </p>
                        <p>
                          {{
                            agentTransport.balanceVolumeUsable
                              ? agentTransport.balanceVolumeUsable
                              : "-"
                          }}
                        </p>
                      </dd>
                    </dl>
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>总瞬时量</p>
                        <p>剩余时间</p>
                      </dt>
                      <dd>
                        <div></div>
                        <p>
                          {{
                            agentTransport.currentInstantFlow
                              ? agentTransport.currentInstantFlow
                              : "-"
                          }}万m³/h
                        </p>
                        <p>
                          {{
                            agentTransport.balanceHour
                              ? agentTransport.balanceHour
                              : "-"
                          }}h
                        </p>
                      </dd>
                    </dl>
                  </div>
                </div>
              </router-link>
            </div>
          </section>
          <!--库存及调峰气量 -->
          <section class="Inventory-box">
            <div class="title">
              <h5>库存及调峰气量</h5>
              <router-link
                :to="{ name: 'peakShaving', query: { status: 2 } }"
                tag="p"
                >管存详情<i class="el-icon-caret-right"></i
              ></router-link>
              <router-link
                :to="{ name: 'peakShaving', query: { status: 1 } }"
                tag="p"
                >库存详情<i class="el-icon-caret-right"></i
              ></router-link>
            </div>
            <div class="Inventory-center">
              <div class="storage">
                <storage-tank
                  :upLimit="tankStoreObject.storeUpRate"
                  :lowerLimit="tankStoreObject.storeLowerRate"
                  :storeRate="tankStoreObject.storeRate"
                ></storage-tank>
              </div>
              <div class="wrapper-table">
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>最大库&管存量</p>
                    <p>当前库&管存量</p>
                  </dt>
                  <dd>
                    <div>万m³</div>
                    <p>
                      {{
                        tankStoreObject.maxStoreVolume
                          ? tankStoreObject.maxStoreVolume
                          : "-"
                      }}
                    </p>
                    <p>
                      {{
                        tankStoreObject.storeVolume
                          ? tankStoreObject.storeVolume
                          : "-"
                      }}
                    </p>
                  </dd>
                </dl>
                <dl>
                  <dt>
                    <div>
                      <span>名称</span>
                      <span>单位</span>
                    </div>
                    <p>可用库&管存量</p>
                    <p>可存入库&管存量</p>
                  </dt>
                  <dd>
                    <div>万m³</div>
                    <p>
                      {{
                        tankStoreObject.usableVolume
                          ? tankStoreObject.usableVolume
                          : "-"
                      }}
                    </p>
                    <p>
                      {{
                        tankStoreObject.enterableVolume
                          ? tankStoreObject.enterableVolume
                          : "-"
                      }}
                    </p>
                  </dd>
                </dl>
              </div>
            </div>
          </section>
          <!--场站 -->
          <stations
            :czStationLists="czStationLists"
            class="station-center"
          ></stations>
        </div>
        <div class="container-right">
          <!--重点场站/管网分布图 -->
          <section class="pipe-box">
            <div class="title">
              <h5>重点场站/管网分布图</h5>
              <router-link
                :to="{ name: 'operationSituation' }"
                tag="p"
                style="margin-left: 510px; color: #fff"
                >运行监控<i class="el-icon-caret-right"></i
              ></router-link>
            </div>
            <div class="map">
              <img
                :src="require('@/idsPages/images/dispatchingHome/map.png')"
              />
            </div>
            <div class="lengend">
              <img
                :src="require('@/idsPages/images/dispatchingHome/lengend.png')"
              />
            </div>
          </section>
          <!-- 输配能力监控 -->
          <section class="transmis-box">
            <div class="title">
              <h5>输配能力监控</h5>
              <div class="button-group" style="width: 117px">
                <span
                  v-for="(item, index) in distributionButGroup"
                  :key="index"
                  @click="changedistribBtn(index)"
                  :class="{ checkedBtn: item.status == 2 }"
                  >{{ item.name }}</span
                >
              </div>
              <router-link
                :to="{
                  name: 'monitorAndControl',
                }"
                tag="p"
                >输配能力详情<i class="el-icon-caret-right"></i
              ></router-link>
              <router-link :to="{ name: 'calculation' }" tag="p"
                >输配能力测算<i class="el-icon-caret-right"></i
              ></router-link>
            </div>
            <div class="table-box">
              <el-table
                class="stock-table"
                border
                height="100%"
                :data="dpipeNetWorkStationData"
                :row-class-name="tableRowClassName"
                style="width: 100%"
              >
                <el-table-column
                  prop="name"
                  :label="monitorAndControlTableName"
                  width="220"
                >
                </el-table-column>
                <el-table-column label="输配能力上限" width="130">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.transportUp ? scope.row.transportUp : "-"
                      }}万m³/h
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="当日输配能力" width="120">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.transportDay ? scope.row.transportDay : "-"
                      }}万m³/h
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="剩余输配能力" width="120">
                  <template slot-scope="scope">
                    <div>
                      {{
                        scope.row.transportSurplus
                          ? scope.row.transportSurplus
                          : "-"
                      }}万m³/h
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="占比">
                  <template slot-scope="scope">
                    <div
                      :class="
                        Number(scope.row.transportDay) >
                        Number(scope.row.upLimit)
                          ? 'fontRed'
                          : ''
                      "
                    >
                      {{
                        scope.row.proportion ? scope.row.proportion + "%" : "-"
                      }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </section>
          <!-- 实时气差监控 -->
          <section class="airdiffer-box">
            <div class="title">
              <h5>气差监控</h5>
            </div>
            <div class="airdiffer-center">
              <div class="tips">
                <h5>购进气差率</h5>
                <div class="tips-center">
                  <div class="progress">
                    <el-progress
                      type="circle"
                      class="progress-common"
                      :percentage="0"
                      :stroke-width="20"
                      stroke-linecap="butt"
                      :color="airDifferenceColors[0]"
                      :width="80"
                      :height="80"
                    ></el-progress>
                    <!-- 
											pngInMonitorEntity.pngInDifferenceRade &&
												pngInMonitorEntity.pngInDifferenceRade > 0
													? pngInMonitorEntity.pngInDifferenceRade > 100
														? 100
														: Math.round(pngInMonitorEntity.pngInDifferenceRade)
													: 0
										-->
                    <p>
                      0%
                      <!-- {{
												pngInMonitorEntity.pngInDifferenceRade
													? Math.round(pngInMonitorEntity.pngInDifferenceRade)
													: 0
											}}% -->
                    </p>
                  </div>
                  <div class="wrapper-table">
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>购气量</p>
                        <p>进气量</p>
                        <p>购进气差</p>
                        <p>购进气差率</p>
                      </dt>
                      <dd>
                        <div></div>
                        <p>
                          {{
                            pngInMonitorEntity.todayTotalPng
                              ? pngInMonitorEntity.todayTotalPng
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          {{
                            pngInMonitorEntity.todayIn
                              ? pngInMonitorEntity.todayIn
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          {{
                            pngInMonitorEntity.pngInDifference
                              ? pngInMonitorEntity.pngInDifference
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          -%
                          <!-- {{
														pngInMonitorEntity.pngInDifferenceRade
															? pngInMonitorEntity.pngInDifferenceRade
															: "-"
													}} -->
                        </p>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="tips">
                <h5>进供气差率</h5>
                <div class="tips-center">
                  <div class="progress">
                    <el-progress
                      type="circle"
                      class="progress-common"
                      :percentage="0"
                      :stroke-width="20"
                      stroke-linecap="butt"
                      :color="airDifferenceColors[1]"
                      :width="80"
                      :height="80"
                    ></el-progress>
                    <!-- 
											inGasMonitorEntity.inGasDifferenceRate &&
												inGasMonitorEntity.inGasDifferenceRate > 0
													? inGasMonitorEntity.inGasDifferenceRate > 100
														? 100
														: Math.round(inGasMonitorEntity.inGasDifferenceRate)
													: 0
											-->
                    <p>
                      0%
                      <!-- {{
												inGasMonitorEntity.inGasDifferenceRate
													? Math.round(inGasMonitorEntity.inGasDifferenceRate)
													: 0
											}}% -->
                    </p>
                  </div>
                  <div class="wrapper-table">
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>进气量</p>
                        <p>供气量</p>
                        <p>进供气差</p>
                        <p>进供气差率</p>
                      </dt>
                      <dd>
                        <div></div>
                        <p>
                          {{
                            inGasMonitorEntity.todayIn
                              ? inGasMonitorEntity.todayIn
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          {{
                            inGasMonitorEntity.gasPngIn
                              ? inGasMonitorEntity.gasPngIn
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          {{
                            inGasMonitorEntity.inGasDifference
                              ? inGasMonitorEntity.inGasDifference
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          -%
                          <!-- {{
														inGasMonitorEntity.inGasDifferenceRate
															? inGasMonitorEntity.inGasDifferenceRate
															: "-"
													}} -->
                        </p>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="tips" style="display: none">
                <h5>购供气差率</h5>
                <dl>
                  <dt>
                    <el-progress
                      type="circle"
                      class="progress-common"
                      :percentage="0"
                      :stroke-width="20"
                      stroke-linecap="butt"
                      :color="airDifferenceColors[2]"
                      :width="80"
                      :height="80"
                    ></el-progress>
                    <!-- 
											pngGasMonitorEntity.pngGasDifferenceRate &&
												pngGasMonitorEntity.pngGasDifferenceRate > 0
													? pngGasMonitorEntity.pngGasDifferenceRate > 100
														? 100
														: Math.round(
																pngGasMonitorEntity.pngGasDifferenceRate
															)
													: 0 
										-->
                    <p>
                      0%
                      <!-- {{
												pngGasMonitorEntity.pngGasDifferenceRate
													? Math.round(pngGasMonitorEntity.pngGasDifferenceRate)
													: 0
											}}% -->
                    </p>
                  </dt>
                  <dd>
                    <p>
                      购气量：{{
                        pngGasMonitorEntity.todayTotalPng
                          ? pngGasMonitorEntity.todayTotalPng
                          : "-"
                      }}
                      万m³
                    </p>
                    <p>
                      供气量：{{
                        pngGasMonitorEntity.gasPngIn
                          ? pngGasMonitorEntity.gasPngIn
                          : "-"
                      }}
                      万m³
                    </p>
                    <p>
                      购供气差：{{
                        pngGasMonitorEntity.pngGasDifference
                          ? pngGasMonitorEntity.pngGasDifference
                          : "-"
                      }}
                      万m³
                    </p>
                    <p>
                      购供气差率：-
                      <!-- {{
												pngGasMonitorEntity.pngGasDifferenceRate
													? pngGasMonitorEntity.pngGasDifferenceRate
													: "-"
											}} -->
                      %
                    </p>
                  </dd>
                </dl>
              </div>
              <div class="tips">
                <h5>供销气差率</h5>
                <div class="tips-center">
                  <div class="progress">
                    <el-progress
                      type="circle"
                      class="progress-common"
                      :percentage="0"
                      :stroke-width="20"
                      stroke-linecap="butt"
                      :color="airDifferenceColors[2]"
                      :width="80"
                      :height="80"
                    ></el-progress>
                    <!-- 
											gasTotalMonitorEntity.gasPinDifferenceRate &&
												gasTotalMonitorEntity.gasPinDifferenceRate > 0
													? gasTotalMonitorEntity.gasPinDifferenceRate > 100
														? 100
														: Math.round(
																gasTotalMonitorEntity.gasPinDifferenceRate
															)
													: 0
											-->
                    <p>
                      0%
                      <!-- {{
												gasTotalMonitorEntity.gasPinDifferenceRate
													? Math.round(
															gasTotalMonitorEntity.gasPinDifferenceRate
														)
													: 0
											}}% -->
                    </p>
                  </div>
                  <div class="wrapper-table">
                    <dl>
                      <dt>
                        <div>
                          <span>名称</span>
                          <span>单位</span>
                        </div>
                        <p>供气量</p>
                        <p>销气量</p>
                        <p>供销气差</p>
                        <p>供销气差率</p>
                      </dt>
                      <dd>
                        <div></div>
                        <p>
                          {{
                            gasTotalMonitorEntity.gasPngIn
                              ? gasTotalMonitorEntity.gasPngIn
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          {{
                            gasTotalMonitorEntity.totalPinGas
                              ? gasTotalMonitorEntity.totalPinGas
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          {{
                            gasTotalMonitorEntity.gasPinDifference
                              ? gasTotalMonitorEntity.gasPinDifference
                              : "-"
                          }}万m³
                        </p>
                        <p>
                          -%
                          <!-- {{
														gasTotalMonitorEntity.gasPinDifferenceRate
															? gasTotalMonitorEntity.gasPinDifferenceRate
															: "-"
													}} -->
                        </p>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopMenu from "../../../components/TopMenu";
import { parseTime, GetDateStr } from "@/idsPages/utils/index";
import oSelect from "./components/select.vue";
import storageTank from "./components/storage-tank.vue";
import usegasWater from "./components/usegas.vue";
import dispatchingApi from "@/idsPages/api/dispatching-home";
import watchBox from "element-resize-detector";
import stations from "./components/stations.vue";

export default {
  name: "dispatchingHome",
  components: {
    oSelect,
    TopMenu,
    storageTank,
    usegasWater,
    stations,
  },
  data() {
    return {
      nowDate: "",
      newHour: "",
      timer: null,
      minitusTimer: null,
      isFullscreen: false,
      selectData: {
        defaultIndex: 0, //默认选中的是第几个
        selectStatus: false, // 通过selectStatus来控制下拉框的显示/隐藏
        selectOptions: [],
      },
      dpipeNetWorkStationData: [], //输配能力监控
      directSales: {}, //客户用气执行跟踪-直销
      agentSales: {}, //客户用气执行跟踪-代销
      agentTransport: {}, //客户用气执行跟踪-代输
      pngInMonitorEntity: {}, //实时气差监控-购进气差
      inGasMonitorEntity: {}, //实时气差监控-进供气差
      pngGasMonitorEntity: {}, //实时气差监控-购供气差
      gasTotalMonitorEntity: {}, //实时气差监控-供销气差
      airDifferenceColors: ["#47A87D", "#F27F04", "#0074FF"],
      czStationLists: null, //场站列表数据
      czColors: [
        //场站颜色
        "#F27F04",
        "#8FDB00",
        "#47A87D",
        "#0074FF",
        "#2F3F95",
      ],
      tankStoreObject: {}, //库存及调峰气量数据
      dailyGasData: {
        //日用气量执行跟踪
        collectDate: "",
        replyVolume: "",
        volumeUsed: "",
        balanceVolumeUsable: "",
        balanceHour: "",
        balanceAvgUsable: "",
        instantFlowUp: "",
        currentInstantFlow: "",
        balanceInstantFlow: "",
        instantFlowRate: "",
        usedRate: "",
      },
      kctfButGroup: [
        {
          //库存及调峰气量btn
          name: "LNG库存",
          status: 2,
        },
        {
          name: "管存",
          status: 1,
        },
      ],
      kctfTable: 1, //1为lng库存，2为管存
      monitorAndControlTableName: "管段",
      distributionButGroup: [
        {
          //输配能力监控btn
          name: "管网",
          status: 2,
        },
        {
          name: "场站",
          status: 1,
        },
      ],
      fontRed: false,
      detail_type: "0",
    };
  },
  watch: {
    nowDate(newval, oldval) {
      if (newval) {
        this.getInfo();
      }
    },
    newHour(newval, oldval) {
      if (newval == 8) {
        let date = new Date().getDate(),
          arr = [];
        this.nowDate = parseTime(new Date(), "{y}-{m}-{d}");
        for (let i = 1; i < date + 1; i++) {
          arr.push({
            name: i < 10 ? `0${i}` : i,
            context: i < 10 ? `0${i}` : i,
          });
        }
        this.selectData.selectOptions = arr;
        this.selectData.defaultIndex = this.selectData.selectOptions.length - 1;
      }
    },
  },
  created() {
    this.defaultTime();
  },
  mounted() {
    this.toggleFullscreen(document.documentElement);
    let erd = watchBox();
    erd.listenTo(document.getElementById("wrapper"), function (element) {
      let width = element.offsetWidth;
      let height = element.offsetHeight;
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 1920 || screenWidth > 1920) {
        //console.log(screenWidth)
        let scaleX = width / 1880;
        let scaleFunc =
          "scale(" + scaleX + "," + scaleX + ")" + "translateZ(0)";
        let dom = document.getElementById("container");
        dom.style.transform = scaleFunc;
        dom.style.transformOrigin = "left top";
        document.getElementById("delivery-wrapper").style.height = `${
          height * scaleX + 100
        }px`;
      }
    });
    this.timer = setInterval(() => {
      let time = new Date().getTime();
      this.newHour = parseTime(new Date(), "{h}");
      // this.newDate = parseTime(time, "{y}年{m}月{d}日");
      // this.nowTime = parseTime(time, "{h}:{i}:{s}");
    }, 1000);
    this.minitusTimer = setInterval(() => {
      this.getInfo();
    }, 1000 * 60 * 3);
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
      clearInterval(this.minitusTimer);
      this.timer = null;
      this.minitusTimer = null;
    }
  },
  methods: {
    defaultTime() {
      let date = "";
      let hour = parseTime(new Date(), "{h}");
      if (hour < 8) {
        date = parseTime(new Date(GetDateStr(-1)), "{d}");
        this.nowDate = GetDateStr(-1);
      } else {
        date = new Date().getDate();
        this.nowDate = parseTime(new Date(), "{y}-{m}-{d}");
      }
      for (let i = 1; i < Number(date) + 1; i++) {
        this.selectData.selectOptions.push({
          name: i < 10 ? `0${i}` : i,
          context: i < 10 ? `0${i}` : i,
        });
      }
      console.log(this.selectData.selectOptions);
      this.selectData.defaultIndex = this.selectData.selectOptions.length - 1;
    },
    toggleFullscreen(element) {
      //全屏幕展示
      var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    getInfo() {
      this.getDailyGasData();
      this.getGasStoreInfo();
      this.getStationData();
      this.getAirDifference();
      this.getGasTracking();
      this.getDistributionMonitorList();
    },
    changeShowStatus() {
      //切换日期选择器状态
      let hour = parseTime(new Date(), "{h}");
      let lastValue = this.selectData.selectOptions.length - 1;
      let time = parseTime(new Date().getTime(), "{d}");
      if (hour >= 8) {
        if (this.selectData.selectOptions[lastValue].context != time) {
          this.selectData.selectOptions.push({
            name: time < 10 ? `0${time}` : time,
            context: time < 10 ? `0${time}` : time,
          });
        }
      }
      this.selectData.selectStatus = !this.selectData.selectStatus;
    },
    onChangeOption(index) {
      //日期选择器
      this.selectData.defaultIndex = index;
      let checked = this.selectData.selectOptions[index].context;
      let time = parseTime(new Date().getTime(), "{d}");
      if (this.timer) {
        clearInterval(this.timer);
        clearInterval(this.minitusTimer);
        this.timer = null;
        this.minitusTimer = null;
      }
      if (checked == time) {
        //选择的是当天的日期
        this.nowDate = parseTime(new Date(), "{y}-{m}-{d}");
        // this.newDate = parseTime(new Date(), "{y}年{m}月{d}日");
        // this.nowTime = parseTime(new Date().getTime(), "{h}:{i}:{s}");
        this.timer = setInterval(() => {
          this.nowTime = parseTime(new Date().getTime(), "{h}:{i}:{s}");
        }, 1000);
        this.minitusTimer = setInterval(() => {
          this.getInfo();
        }, 1000 * 60 * 3);
      } else {
        // this.nowTime = "";
        // this.newDate = "";
        this.nowDate = `${parseTime(
          new Date().getTime(),
          "{y}-{m}"
        )}-${checked}`;
      }
    },
    getDailyGasData() {
      //日用气量执行跟踪
      let params = {
        collectDate: this.nowDate,
      };
      dispatchingApi.getDailyGasData(params).then((res) => {
        if (res.resultCode == 0) {
          const list = res.data;
          for (let key in list) {
            if (this.dailyGasData.hasOwnProperty(key)) {
              if (key == "collectDate") {
                this.dailyGasData[key] = parseTime(
                  list[key],
                  "{y}年{m}月{d}日"
                );
              } else {
                this.dailyGasData[key] = list[key];
              }
            }
          }
        }
      });
    },
    getGasStoreInfo() {
      //库存及调峰气量
      let params = {
        collectDate: this.nowDate,
      };
      dispatchingApi.getGasStoreInfo(params).then((res) => {
        if (res.resultCode == 0) {
          this.tankStoreObject = res.data;
        }
      });
    },
    getStationData() {
      //场站
      let params = {
        collectDate: this.nowDate,
      };
      dispatchingApi.getStationData(params).then((res) => {
        if (res.resultCode == 0) {
          this.czStationLists = res.data;
        }
      });
    },
    getAirDifference() {
      //实时气差监控
      let params = {
        collectDate: this.nowDate,
      };
      dispatchingApi.getAirDifference(params).then((res) => {
        if (res.resultCode == 0) {
          this.pngInMonitorEntity = res.data.pngInMonitorEntity;
          this.pngGasMonitorEntity = res.data.pngGasMonitorEntity;
          this.gasTotalMonitorEntity = res.data.gasTotalMonitorEntity;
          this.inGasMonitorEntity = res.data.inGasMonitorEntity;
        }
      });
    },
    getGasTracking() {
      //客户用气执行跟踪
      let params = {
        timeType: "day",
        timeValue: this.nowDate,
      };
      dispatchingApi.getGasTracking(params).then((res) => {
        if (res.resultCode == 0) {
          this.directSales = res.data.directSales; //直销
          this.agentSales = res.data.agentSales; //代销
          this.agentTransport = res.data.agentTransport; //代输
        }
      });
    },

    tableRowClassName({ row, rowIndex }) {
      //table偶数行添加背景色
      if (rowIndex % 2 === 1) {
        return "double-row";
      }
      return "";
    },
    changeBtn(val) {
      this.kctfTable = val + 1;
      this.kctfButGroup.map((item, index) => {
        if (index == val) {
          item.status = 2;
        } else {
          item.status = 1;
        }
      });
    },
    getDistributionMonitorList() {
      this.detail_type = "0";
      sessionStorage.setItem("tabLiNum", this.detail_type);
      this.distributionButGroup[0].status = 2;
      this.distributionButGroup[1].status = 1;
      let params = {
        type: 1,
        dateTime: this.nowDate,
      };
      dispatchingApi.getDistributionMonitorList(params).then((res) => {
        if (res.resultCode == 0) {
          this.dpipeNetWorkStationData = res.data;
        }
      });
    },
    changedistribBtn(val) {
      this.distributionButGroup.map((item, index) => {
        if (index == val) {
          item.status = 2;
        } else {
          item.status = 1;
        }
      });
      if (val === 0) {
        //管网
        this.detail_type = "0";
        sessionStorage.setItem("tabLiNum", this.detail_type);
        let params = {
          type: 1,
          dateTime: this.nowDate,
        };
        dispatchingApi.getDistributionMonitorList(params).then((res) => {
          if (res.resultCode == 0) {
            this.monitorAndControlTableName = "管段";
            this.dpipeNetWorkStationData = res.data;
          }
        });
      } else {
        //场站
        this.detail_type = "1";
        sessionStorage.setItem("tabLiNum", this.detail_type);
        let params = {
          type: 2,
          dateTime: this.nowDate,
        };
        dispatchingApi.getDistributionMonitorList(params).then((res) => {
          if (res.resultCode == 0) {
            this.monitorAndControlTableName = "场站";
            this.dpipeNetWorkStationData = res.data;
          }
        });
      }
    },
  },
};
</script>
<style lang="scss">
.progress-common {
  display: block;
  .el-progress__text {
    display: none;
  }
}
.stock-table {
  color: #303133;
  font-size: 12px;
  .double-row {
    background: #f2f6fc;
  }
  tr {
    td,
    th {
      padding: 3px 0;
      border-right: 1px solid #ebeef5;
      &:last-child {
        border-right: none;
      }
    }
    th:nth-last-child(2) {
      border-right: none;
    }
  }
}
</style>
<style lang='scss' rel='stylesheet/scss' scoped>
* {
  margin: 0;
  padding: 0;
}
.fontRed {
  color: #f5222d;
}
.gas-page-bg {
  background-image: none;
  background-size: 100% 650px;
}
.delivery-wrapper {
  width: 100%;
  position: relative;
  .content-wrapper {
    position: relative;
    width: calc(100% - 40px);
    height: 981px;
    margin: 20px;
    // overflow-x: auto;
    .normalColor {
      color: #47a87d;
    }
    .floorColor {
      color: #2f3f95;
    }
    .exceedColor {
      color: #f5222d;
    }
    .no-data {
      position: relative;
      top: 50%;
      left: 50%;
      width: 100%;
      text-align: center;
      color: #c0c4cc;
      font-size: 14px;
      transform: translate(-50%, -50%);
    }
    section {
      width: 100%;
      padding: 0 10px;
      border-radius: 8px;
      background: #fff;
      box-sizing: border-box;
      overflow: hidden;
      .title {
        h5 {
          font-size: 16px;
          font-weight: 500;
          line-height: 28px;
          color: #303133;
          float: left;
          &::before {
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 5px;
            background: #47a87d;
          }
        }
        .select {
          width: 61px;
          height: 28px;
          float: left;
          margin-top: 2px;
          margin-left: 646px !important;
        }
        p {
          float: right;
          color: #303133;
          font-size: 14px;
          line-height: 28px;
          margin-left: 20px;
          cursor: pointer;
        }
        .button-group {
          width: 145px;
          height: 28px;
          margin: 2px 0 0 10px;
          border-radius: 14px;
          overflow: hidden;
          float: left;
          span {
            padding: 0 15px;
            display: inline-block;
            line-height: 28px;
            font-size: 14px;
            color: #303133;
            background: #eef0f7;
            cursor: pointer;
          }
          span.checkedBtn {
            color: #fff;
            background: #47a87d;
          }
        }
      }
    }
    .table-box {
      height: 150px;
      clear: both;
      margin-bottom: 4px;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress {
      position: relative;
      p {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        text-align: center;
        transform: translate(0, -50%);
      }
    }
    .wrapper-table {
      flex: 1;
      display: flex;
      dl {
        display: flex;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #e8e8e8;
        overflow: hidden;
        dt,
        dd {
          width: 1px;
          flex: 1;
          p {
            color: #303133;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:last-child {
              border-bottom: none;
            }
          }
          p,
          div {
            height: 28px;
            line-height: 28px;
            padding-left: 16px;
            font-size: 12px;
            border-bottom: 1px solid #e8e8e8;
          }
        }
        dt {
          p {
            background: #f2f6fc;
            border-right: 1px solid #e8e8e8;
          }
          div {
            display: flex;
            padding-right: 16px;
            justify-content: space-between;
            background-image: linear-gradient(
              to top right,
              #f2f6fc 48%,
              #e8e8e8,
              #edfff7 52%
            );
            border-right: 1px solid #e8e8e8;
            span {
              font-size: 12px;
              line-height: 21px;
              color: #909399;
              &:first-child {
                margin-top: 7px;
              }
            }
          }
        }
        dd {
          div {
            color: #909399;
            background: #edfff7;
          }
        }
      }
    }
    .container-left {
      width: 935px;
      float: left;
      .dailygas-box {
        height: 193px;
        .dailygas-top {
          display: flex;
          clear: both;
          align-items: center;
          padding-top: 6px;
          .progress {
            margin: 0px 11px 0px 15px;
            p {
              font-size: 15.5555px;
            }
          }
          .wrapper-table {
            justify-content: space-between;
            dl {
              width: 250px;
            }
          }
        }
      }
      .usegas-box {
        margin-top: 10px;
        height: 193px;
        .tips-group {
          display: flex;
          justify-content: space-between;
          clear: both;
          cursor: pointer;
          .tips {
            width: 1px;
            flex: 1;
            h5 {
              span {
                display: inline-block;
                margin-left: 10px;
                &:first-child {
                  font-size: 16px;
                  font-weight: 400;
                  color: #303133;
                  line-height: 22px;
                }
                &:last-child {
                  img {
                    width: 12px;
                    margin-right: 3px;
                    display: inline-block;
                  }
                  margin-left: 5px;
                  font-size: 12px;
                  font-weight: 400;
                  color: #303133;
                  line-height: 22px;
                }
              }
            }
            .tips-top {
              display: flex;
              .usegas-progress {
                margin: 10px 0 0 15px;
                width: 120px;
                height: 110px;
              }
              .wrapper-table {
                height: 157px;
                margin-left: 5px;
                flex-direction: column;
                dl {
                  dt,
                  dd {
                    p,
                    div {
                      height: 21px;
                      line-height: 21px;
                    }
                  }
                  dt {
                    div {
                      padding: 0 3px;
                      span {
                        &:first-child {
                          margin-top: 3px;
                        }
                        &:last-child {
                          line-height: 15px;
                        }
                      }
                    }
                  }
                  dd {
                    div {
                      padding-left: 6px;
                    }
                  }
                  &:last-child {
                    margin-top: 4px;
                  }
                }
              }
            }
            &:first-child {
              h5 {
                span {
                  &:first-child {
                    margin-left: 0;
                  }
                }
              }
            }
            &:last-child {
              dl {
                dd {
                  border-right: none;
                }
              }
            }
          }
        }
      }
      .Inventory-box {
        height: 193px;
        margin-top: 10px;
        .Inventory-center {
          margin-top: 51px;
          clear: both;
          display: flex;
          align-items: center;
          .storage {
            width: 120px;
            height: 110px;
            margin: 0 22px 0 26px;
          }
          .wrapper-table {
            dl {
              flex: 1;
              dt,
              dd {
                p,
                div {
                  height: 37px;
                  line-height: 37px;
                }
              }
              dt {
                div {
                  span {
                    &:first-child {
                      margin-top: 15px;
                    }
                  }
                }
              }
              &:first-child {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .station-center {
        width: 100%;
        height: 466px;
        margin-top: 10px;
        overflow-y: auto;
        .tips {
          width: 340px;
          height: 142px;
          float: left;
          margin-top: 10px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #dcdfe6;
          box-sizing: border-box;
          &:nth-child(2n-1) {
            margin-right: 10px;
          }
          &:last-child {
            margin-bottom: 0;
          }
          h5 {
            display: flex;
            align-items: center;
            img {
              display: block;
              width: 12px;
              margin-right: 4px;
            }
            margin: 5px 0 0 10px;
            font-size: 16px;
            font-weight: 500;
            color: #303133;
            line-height: 22px;
          }
          dl {
            display: flex;
            align-items: center;
            padding: 0 20px 0 30px;
            dt {
              flex: 1;
              p {
                color: #303133;
                font-size: 12px;
                margin-top: 5px;
                line-height: 17px;
              }
            }
            dd {
              width: 100px;
              margin-top: -16px;
              position: relative;
              p {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                text-align: center;
                font-size: 13.1111px;
                transform: translate(0, -50%);
              }
            }
          }
        }
      }
    }
    .container-right {
      width: 935px;
      float: right;
      .pipe-box {
        height: 600px;
        padding: 0;
        margin-bottom: 10px;
        background: linear-gradient(#3f70b7, #1e4290);
        .title {
          padding: 0 10px;
          h5 {
            color: #fff;
          }
        }
        .map {
          width: auto;
          height: 447px;
          margin: 74px 0 50px 95px;
          img {
            height: 100%;
            display: block;
          }
        }
        .lengend {
          img {
            height: 20px;
            margin-left: 10px;
            display: block;
          }
        }
      }
      .airdiffer-box {
        height: 181px;
        margin-top: 10px;
        .airdiffer-center {
          margin-top: 5px;
          clear: both;
          display: flex;
          justify-content: space-between;
          .tips {
            width: 1px;
            flex: 1;
            h5 {
              margin-left: 13px;
              font-size: 14px;
              font-weight: 400;
              color: #303133;
              line-height: 20px;
            }
            .tips-center {
              display: flex;
              align-items: center;
              .progress {
                width: 80px;
                height: 80px;
                margin-left: 23px;
                margin-right: 21px;
              }
              .wrapper-table {
                dl {
                  width: 100%;
                  dt,
                  dd {
                    p {
                      height: 24px;
                      line-height: 24px;
                    }
                    div {
                      height: 22px;
                    }
                  }
                  dt {
                    div {
                      padding: 0 3px;
                      span {
                        line-height: 18px;
                        &:first-child {
                          margin-top: 5px;
                        }
                      }
                    }
                  }
                }
              }
            }
            &:first-child {
              h5 {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
